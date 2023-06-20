import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import ELK, { ElkNode } from 'elkjs';
import { ReactFlow, Node, Edge } from 'reactflow';
import styled from 'styled-components';

import 'reactflow/dist/style.css';
// import { CandidateMap, Ballot } from 'types/graph';
import { generateTree } from 'helpers/generateTree';
import { GraphNode, NODE_TYPE_GRAPH_NODE } from 'components/GraphNode';
import { prismaContext } from 'lib/prisma';
import { getAdminPosition } from 'services/prisma';
import { ParsedUrlQuery } from 'querystring';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const FlowWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const IndexPage: NextPage<Props> = ({ nodes, edges }) => {
  const nodeTypes = useMemo(() => ({ [NODE_TYPE_GRAPH_NODE]: GraphNode }), []);

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
          minZoom={0.05}
          nodesConnectable={false}
          nodesDraggable={false}
          edgesFocusable={false}
          panOnScroll={true}
        />
      </FlowWrapper>
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

  const { nodes, edges } = generateTree(position);

  const elk = new ELK();
  const generateElkLayout = <T,>(nodes: Node[], edges: Edge<T>[]) => {
    const nodesForElk: ElkNode[] = nodes.map((node) => {
      return {
        id: node.id,
        width: 200,
        height: position.candidates.length * 20 + 20 * 2
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

    if (node) {
      node.position = { x: elkNode.x || 0, y: elkNode.y || 0 };
    }
  });

  return {
    props: {
      nodes,
      edges
    }
  };
};

export default IndexPage;
