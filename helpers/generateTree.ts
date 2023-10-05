import {
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
import { Edge, Position, Node } from 'reactflow';

export const generateTree = (position: AdminPosition) => {
  const { candidates, ballots, openSeats } = position;
  const parsedBallots = ballots.map((ballot) => ({
    id: ballot.id,
    ranking: ballot.ballotItems.map((item) => item.candidateId)
  }));

  const candidatesMap = new Map(
    candidates.map((candidate) => [candidate.id, candidate])
  );

  const initialOptions: ResultNodeOptions = {
    ballots: parsedBallots,
    savedBallots: [],
    candidates: candidatesMap,
    savedCandidates: new Map(),
    winners: [],
    losers: [],
    incomingNodePercentage: 100,
    positionsToFill: openSeats
  };

  const initialOptionsHash = generateOptionsHash(initialOptions);
  const queue = [{ hash: initialOptionsHash, options: initialOptions }];
  const hashMap = new Map<ResultHash, NodeHash>();
  const nodes = new Map<NodeHash, GraphNode>();

  // While queue is not empty
  let iterator = 0;
  while (queue.length > 0) {
    iterator += 1;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Iteration ${iterator}, queue length: ${queue.length}`);
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
      existingNode.percentageOutcome +=
        currentOptions.options.incomingNodePercentage;

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
      incomingNodePercentage: currentOptions.options.incomingNodePercentage
    });

    // Save options-hash on current node
    node.children = childOptions.map((child) => child.hash);

    // Add to queue
    queue.push(...childOptions);
  }

  // Loop through and replace options-hashes with node-hashes
  nodes.forEach((node) => {
    node.children = node.children.map((optionsHash) => {
      const resultHash = hashMap.get(optionsHash);
      if (!resultHash) throw new Error('Invalid options hash');

      return resultHash;
    });
  });

  const newNodes: Node<GraphNodeData | OverflowData>[] = [];
  const edges: Edge<{}>[] = [];
  nodes.forEach((node) => {
    newNodes.push({
      id: node.hash,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: { y: 0, x: 0 },
      data: {
        type: 'graphNode',
        node: { ...node, results: [...node.results] },
        candidates: [...candidatesMap]
      },
      type: NODE_TYPE_GRAPH_NODE
    });

    node.children.forEach((child) => {
      edges.push({
        id: `${node.hash}-${child}`,
        source: node.hash,
        target: child,
        style: { stroke: 'white', strokeWidth: 1 }
      });
    });
  });

  return {
    nodes: newNodes,
    edges
  };
};
