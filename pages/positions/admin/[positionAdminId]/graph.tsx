import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import ELK, { ElkNode } from 'elkjs';
import { ReactFlow, Node, Edge, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';

import 'reactflow/dist/style.css';
import { GraphNode, NODE_TYPE_GRAPH_NODE } from 'components/GraphNode';
import { prismaContext } from 'lib/prisma';
import { getAdminPosition } from 'services/prisma';
import { ParsedUrlQuery } from 'querystring';
import {
  Candidate,
  CandidateSmallId,
  GraphNodeData,
  OverflowData,
  SimpleCandidateMap,
  isGraphNodeData
} from 'types/graph';
import { selectWinner } from 'services/local';
import { NODE_TYPE_OVERFLOW_NODE, OverflowNode } from 'components/OverflowNode';
import { getGraph } from 'helpers/getGraph';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const FlowWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const WinnerButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
`;

interface Props {
  nodes: Node[];
  edges: Edge[];
  candidates: SimpleCandidateMap;
  positionAdminId: string;
}

const graphNodeWithCandidates = (candidates: SimpleCandidateMap) =>
  function ExtendedGraphNode(props: NodeProps<GraphNodeData>) {
    return <GraphNode node={props.data.node} candidates={candidates} />;
  };

const IndexPage: NextPage<Props> = ({
  nodes,
  edges,
  candidates,
  positionAdminId
}) => {
  const nodeTypes = useMemo(
    () => ({
      [NODE_TYPE_GRAPH_NODE]: graphNodeWithCandidates(candidates),
      [NODE_TYPE_OVERFLOW_NODE]: OverflowNode
    }),
    [candidates]
  );

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    const result = await selectWinner(positionAdminId);

    console.log(result);
  };

  return (
    <Container>
      <Head>
        <title>IRV</title>
      </Head>
      <FlowWrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView={true}
          fitViewOptions={{
            minZoom: 1
          }}
          minZoom={0.05}
          nodesConnectable={false}
          nodesDraggable={false}
          edgesFocusable={false}
          panOnScroll={true}
        />
      </FlowWrapper>
      <WinnerButton onClick={handleClick}>Select winner</WinnerButton>
    </Container>
  );
};

interface Params extends ParsedUrlQuery {
  positionAdminId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.positionAdminId) {
    throw new Error('No team ID in params');
  }

  const position = await getAdminPosition(
    prismaContext,
    context?.params?.positionAdminId
  );

  if (!position) {
    return {
      redirect: {
        destination: '/create',
        permanent: false
      }
    };
  }

  const { nodes: calculatedNodes, edges: calculatedEdges } = await getGraph(
    position
  );

  const NODE_CUTOFF = 2000;

  const edgeSources = calculatedEdges.map((edge) => edge.source);
  const leafNodes = calculatedNodes.filter(
    (node) => !edgeSources.includes(node.id)
  );
  const nodes: Node<GraphNodeData | OverflowData>[] = [];
  const edges: typeof calculatedEdges = [];

  if (calculatedNodes.length > NODE_CUTOFF) {
    const rootNode = { ...calculatedNodes[0] };
    const overflowNode: Node<OverflowData> = {
      id: 'overflow',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: { y: 0, x: 0 },
      data: {
        type: 'overflow'
      },
      type: NODE_TYPE_OVERFLOW_NODE
    };

    edges.push({
      id: `root-overflow`,
      source: rootNode.id,
      target: 'overflow'
    });
    edges.push(
      ...leafNodes.map((node) => ({
        id: `overflow-${node.id}`,
        source: 'overflow',
        target: node.id
      }))
    );
    nodes.push(calculatedNodes[0], overflowNode, ...leafNodes);
  } else {
    nodes.push(...calculatedNodes);
    edges.push(...calculatedEdges);
  }

  const elk = new ELK();
  const generateElkLayout = <T,>(nodes: Node[], edges: Edge<T>[]) => {
    const CANDIDATE_HEIGHT = 20;
    const PADDING_HEIGHT = 20;
    const PERCENTAGE_HEIGHT = 50;

    const nodesForElk: ElkNode[] = nodes.map((node) => {
      return {
        id: node.id,
        width: 300,
        height: isGraphNodeData(node.data)
          ? position.candidates.length * CANDIDATE_HEIGHT +
            PADDING_HEIGHT * 2 +
            PERCENTAGE_HEIGHT
          : 130
      };
    });

    const graph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.direction': 'RIGHT',
        'nodePlacement.strategy': 'NETWORK_SIMPLEX'
      },
      children: nodesForElk,
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target]
      }))
    };

    return elk.layout(graph);
  };

  const layout = await generateElkLayout(nodes, edges);
  layout?.children?.forEach((elkNode) => {
    const node = nodes.find((n) => n.id === elkNode.id);
    const isLeaf = !edgeSources?.includes(elkNode.id);

    if (node) {
      node.position = { x: elkNode.x || 0, y: elkNode.y || 0 };
      if (isGraphNodeData(node.data) && isLeaf) node.data.node.isLeaf = isLeaf;
    }
  });

  const candidatesMap = position.candidates.map(
    (candidate) =>
      [candidate.smallId, candidate] as [CandidateSmallId, Candidate]
  );

  return {
    props: {
      nodes,
      edges: edges.map((edge) => ({
        ...edge,
        style: { stroke: 'white', strokeWidth: 1 }
      })),
      candidates: candidatesMap,
      positionAdminId: position.adminId
    }
  };
};

export default IndexPage;
