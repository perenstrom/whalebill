import {
  Ballot,
  GraphNode,
  GraphNodeData,
  NodeHash,
  OverflowData,
  ResultHash,
  ResultNodeOptions
} from 'types/graph';
import { calculateResults } from './calculateResults';
import { generateOptionsHash } from './generateOptionsHash';
import { generateResultNode } from './generateResultNode';
import { AdminPosition } from 'types/types';
import { NODE_TYPE_GRAPH_NODE } from 'components/GraphNode';
import { Edge, Node } from 'reactflow';

export const generateTree = (position: AdminPosition) => {
  const { candidates, ballots, openSeats } = position;
  const parsedBallots: Ballot[] = ballots.map((ballot) => ({
    id: ballot.id,
    ranking: ballot.ballotItems.map((item) => item.candidateSmallId || 0)
  }));

  const candidatesMap = new Map(
    candidates.map((candidate) => [candidate.smallId, candidate])
  );

  const initialOptions: ResultNodeOptions = {
    ballots: parsedBallots,
    savedBallots: [],
    candidates: candidatesMap,
    savedCandidates: new Map(),
    winners: [],
    losers: [],
    positionsToFill: openSeats
  };

  const initialOptionsHash = generateOptionsHash(initialOptions);
  const queue = [{ hash: initialOptionsHash, options: initialOptions }];
  const hashMap = new Map<ResultHash, NodeHash>();
  const nodes = new Map<NodeHash, GraphNode>();

  // While queue is not empty
  //let iterator = 0;
  while (queue.length > 0) {
    //iterator += 1;
    if (process.env.NODE_ENV === 'development') {
      // console.log(`Iteration ${iterator}, queue length: ${queue.length}`);
    }

    // Shift array
    const currentOptions = queue.shift();
    if (!currentOptions) continue;

    // Generate node
    const node = generateResultNode(currentOptions.options);

    // Save options-hash -> node-hash
    hashMap.set(currentOptions.hash, node.hash);

    // Check if node exists
    const existingNode = nodes.get(node.hash);
    if (existingNode) {
      existingNode.percentageOutcome += node.percentageOutcome;
      continue;
    }

    nodes.set(node.hash, node);

    // Calculate results
    const childOptions = calculateResults({
      ballots: currentOptions.options.ballots,
      savedBallots: currentOptions.options.savedBallots,
      candidates: currentOptions.options.candidates,
      savedCandidates: currentOptions.options.savedCandidates,
      sortedResults: node.results,
      positionsToFill: currentOptions.options.positionsToFill,
      previousWinners: node.winners,
      previousLosers: node.losers,
    });

    // Save options-hash on current node
    node.children = childOptions.map((child) => child.hash);

    // Add to queue
    queue.push(...childOptions);
  }

  // Loop through and
  // 1. replace options-hashes with node-hashes
  // 2. calculate percentages
  const nodePercentageMap = new Map<string, number>();
  const firstResultHash = (nodes.entries().next().value[1] as GraphNode).hash;
  if (!firstResultHash) throw new Error('Invalid options hash');

  nodePercentageMap.set(firstResultHash, 100);

  nodes.forEach((node) => {
    const newChildren: string[] = [];
    node.children.forEach((childOptionsHash) => {
      const resultHash = hashMap.get(childOptionsHash);
      if (!resultHash) throw new Error('Invalid options hash');

      newChildren.push(resultHash);

      const percentage = nodePercentageMap.get(node.hash) ?? 100;
      const childPercentage = nodePercentageMap.get(resultHash) ?? 0;
      nodePercentageMap.set(
        resultHash,
        childPercentage + percentage / node.children.length
      );
    });

    node.children = newChildren;
  });

  const newNodes: Node<GraphNodeData | OverflowData>[] = [];
  const edges: Edge<{}>[] = [];
  nodes.forEach((node) => {
    newNodes.push({
      id: node.hash,
      position: { y: 0, x: 0 },
      data: {
        type: 'graphNode',
        node: {
          ...node,
          results: [...node.results],
          percentageOutcome: nodePercentageMap.get(node.hash) ?? 100
        }
      },
      type: NODE_TYPE_GRAPH_NODE
    });

    node.children.forEach((child, i) => {
      edges.push({
        id: `${node.hash}-${i}`,
        source: node.hash,
        target: child
      });
    });
  });

  return {
    nodes: newNodes,
    edges
  };
};
