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
  while (queue.length > 0) {
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
      previousLosers: node.losers
    });

    // Save options-hash on current node
    node.children = childOptions.map((child) => child.hash);

    // Add to queue
    queue.push(...childOptions);
  }

  // Generate edges and map of connections in both directions
  // Also replace options-hash in children with node-hash
  const edges: Edge<{}>[] = [];
  const nodeConnections = new Map<
    string,
    { parents: string[]; children: string[] }
  >();

  nodes.forEach((node) => {
    let nodeConnectionsEntry = nodeConnections.get(node.hash);
    if (!nodeConnectionsEntry) {
      const newConnectionEntry = { parents: [], children: [] };
      nodeConnections.set(node.hash, newConnectionEntry);
      nodeConnectionsEntry = newConnectionEntry;
    }

    node.children = node.children.map((childOptionsHash, i) => {
      const resultHash = hashMap.get(childOptionsHash);
      if (!resultHash) throw new Error('Invalid options hash');

      edges.push({
        id: `${node.hash}-${i}`,
        source: node.hash,
        target: resultHash
      });

      let childNodeConnectionsEntry = nodeConnections.get(resultHash);
      if (!childNodeConnectionsEntry) {
        const newChildConnectionEntry = { parents: [], children: [] };
        nodeConnections.set(resultHash, newChildConnectionEntry);
        childNodeConnectionsEntry = newChildConnectionEntry;
      }

      childNodeConnectionsEntry.parents.push(node.hash);

      return resultHash;
    });

    nodeConnectionsEntry.children = node.children;
  });

  // Calculate percentages
  const nodePercentageMap = new Map<string, number>();
  const firstResultHash = (nodes.entries().next().value[1] as GraphNode).hash;
  if (!firstResultHash) throw new Error('Invalid options hash');

  const percentageCalculationQueue = [firstResultHash];

  while (percentageCalculationQueue.length > 0) {
    const currentNodeHash = percentageCalculationQueue.shift();
    if (!currentNodeHash) throw new Error('Queue empty');

    // Node is already done
    if (nodePercentageMap.has(currentNodeHash)) continue;

    const currentNodeConnections = nodeConnections.get(currentNodeHash);
    if (!currentNodeConnections) throw new Error('Invalid node hash');

    // Check if node has no parents
    if (currentNodeConnections.parents.length === 0) {
      nodePercentageMap.set(currentNodeHash, 100);
      percentageCalculationQueue.push(...currentNodeConnections.children);
      continue;
    }

    // Check if all parents have percentages calculated
    if (
      currentNodeConnections.parents.every((parentHash) =>
        nodePercentageMap.has(parentHash)
      )
    ) {
      // Percentage is sum of (parent percentage / number of parent children)
      const nodePercentage = currentNodeConnections.parents.reduce(
        (acc, parentHash) => {
          const numberOfSiblings =
            nodeConnections.get(parentHash)?.children.length ?? 1;
          const parentPercentage = nodePercentageMap.get(parentHash) ?? 100;
          const inheritedPercentage = parentPercentage / numberOfSiblings;

          return acc + inheritedPercentage;
        },
        0
      );

      nodePercentageMap.set(currentNodeHash, nodePercentage);
      percentageCalculationQueue.push(...currentNodeConnections.children);
    } else {
      // Otherwise move to end of queue
      percentageCalculationQueue.push(currentNodeHash);
    }
  }

  const newNodes: Node<GraphNodeData | OverflowData>[] = [];
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
  });

  return {
    nodes: newNodes,
    edges
  };
};
