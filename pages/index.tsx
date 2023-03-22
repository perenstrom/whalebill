import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import ELK, { ElkNode } from 'elkjs';
import { Container, Box } from '@mui/material';
import { ReactFlow, Node, Edge, Position } from 'reactflow';

import 'reactflow/dist/style.css';
import { CandidateMap, Ballot } from 'types/types';
import { generateTree } from 'helpers/generateTree';

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const IndexPage: NextPage<Props> = ({ nodes, edges }) => {
  return (
    <Container maxWidth="lg" sx={{ height: '100vh', padding: '0px' }}>
      <Head>
        <title>IRV</title>
      </Head>
      <Box sx={{ width: '100%', height: '100%' }}>
        <ReactFlow nodes={nodes} edges={edges} />
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  console.log(performance.now());
  const candidates: CandidateMap = new Map([
    ['847', { id: '847', name: 'Candidate 1' }],
    ['848', { id: '848', name: 'Candidate 2' }],
    ['849', { id: '849', name: 'Candidate 3' }],
    ['850', { id: '850', name: 'Candidate 4' }],
    ['851', { id: '851', name: 'Candidate 5' }],
    ['852', { id: '852', name: 'Candidate 6' }],
    ['853', { id: '853', name: 'Candidate 7' }],
    ['854', { id: '854', name: 'Candidate 8' }],
    ['855', { id: '855', name: 'Candidate 9' }]
  ]);

  const ballots: Ballot[] = [
    {
      id: 1,
      ranking: ['851', '849', '852', '853', '847', '850']
    },
    {
      id: 2,
      ranking: ['847', '852', '853', '848', '851', '850']
    },
    {
      id: 3,
      ranking: ['849', '847', '851', '852', '848', '853', '850']
    },
    {
      id: 4,
      ranking: ['852', '847', '850', '848', '853', '851', '849']
    },
    {
      id: 5,
      ranking: ['847', '848', '850', '851', '852', '849']
    },
    {
      id: 6,
      ranking: ['853', '852', '847', '851', '850', '849', '848']
    },
    {
      id: 7,
      ranking: ['851', '852', '853', '847', '848', '850']
    },
    {
      id: 8,
      ranking: ['852', '853', '851', '850', '849', '848']
    },
    {
      id: 9,
      ranking: ['853', '852', '847', '848', '849', '850']
    },
    {
      id: 10,
      ranking: ['852', '847', '850', '848', '849', '851', '853']
    },
    {
      id: 11,
      ranking: ['852', '850', '847', '848', '849', '851']
    },
    {
      id: 12,
      ranking: ['847', '848', '849', '851', '852', '853']
    },
    {
      id: 13,
      ranking: ['847', '852', '849', '853', '851', '850', '848']
    },
    {
      id: 14,
      ranking: ['853', '847', '852', '848', '851', '850']
    },
    {
      id: 15,
      ranking: ['852', '847', '853', '849', '851', '848', '850']
    },
    {
      id: 16,
      ranking: ['852', '851', '847', '849', '853', '850']
    },
    {
      id: 17,
      ranking: ['852', '847', '850', '851', '849', '848']
    },
    {
      id: 18,
      ranking: ['853', '852', '847', '848', '849', '850']
    },
    {
      id: 19,
      ranking: ['847', '852', '851', '849', '853', '850']
    },
    {
      id: 20,
      ranking: ['852', '849', '851', '847', '848', '853']
    },
    {
      id: 21,
      ranking: ['847', '852', '853', '848', '851', '850', '849']
    },
    {
      id: 22,
      ranking: ['852', '851', '847', '848', '849', '853']
    },
    {
      id: 23,
      ranking: ['852', '853', '851', '847']
    },
    {
      id: 24,
      ranking: ['847', '852', '849', '848', '853']
    },
    {
      id: 25,
      ranking: ['852', '848', '850', '851', '847']
    },
    {
      id: 26,
      ranking: ['849', '847', '852', '851', '853', '850', '848']
    },
    {
      id: 27,
      ranking: ['847', '852', '850', '851', '853', '849']
    },
    {
      id: 28,
      ranking: ['847', '850', '853', '849', '848', '851']
    },
    {
      id: 29,
      ranking: ['853', '852', '849', '847', '851']
    },
    {
      id: 30,
      ranking: ['847', '848', '852', '849', '850', '851', '853']
    },
    {
      id: 31,
      ranking: ['847', '848', '851', '849', '852', '853', '850']
    },
    {
      id: 32,
      ranking: ['852', '853', '847', '848', '850', '851']
    },
    {
      id: 33,
      ranking: ['852', '853', '848', '847', '849']
    },
    {
      id: 34,
      ranking: ['852', '850', '847', '849', '848', '851']
    },
    {
      id: 35,
      ranking: ['852', '853', '851', '847']
    },
    {
      id: 36,
      ranking: ['853', '852', '851', '850', '848', '847']
    }
  ];

  const tree = generateTree({
    ballots,
    candidates,
    positionsToFill: 6
  });

  const nodes: Node[] = [];
  const edges: Edge<{}>[] = [];

  tree.forEach((node) => {
    nodes.push({
      id: node.hash,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: { y: 0, x: 0 },
      data: { label: node.hash }
    });

    node.children.forEach((child) => {
      edges.push({
        id: `${node.hash}-${child}`,
        source: node.hash,
        target: child
      });
    });
  });

  const elk = new ELK();
  const generateElkLayout = <T,>(nodes: Node[], edges: Edge<T>[]) => {
    const nodesForElk: ElkNode[] = nodes.map((node) => {
      return {
        id: node.id,
        width: 200,
        height: 100
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
