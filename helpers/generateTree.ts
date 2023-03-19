import {
  Ballot,
  CandidateMap,
  GraphNode,
  NodeHash,
  ResultHash,
  ResultNodeOptions
} from 'types/types';
import { calculateResults } from './calculateResults';
import { generateOptionsHash } from './generateOptionsHash';
import { generateResultNode } from './generateResultNode';

interface Input {
  candidates: CandidateMap;
  ballots: Ballot[];
  positionsToFill: number;
}

export const generateTree = (input: Input) => {
  const initialOptions: ResultNodeOptions = {
    ballots: input.ballots,
    savedBallots: [],
    candidates: input.candidates,
    savedCandidates: new Map(),
    winners: [],
    losers: [],
    positionsToFill: input.positionsToFill
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
    if (nodes.has(node.hash)) continue;

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

  // Loop through and replace options-hashes with node-hashes
  nodes.forEach((node) => {
    node.children = node.children.map((optionsHash) => {
      const resultHash = hashMap.get(optionsHash);
      if (!resultHash) throw new Error('Invalid options hash');

      return resultHash;
    });
  });

  return nodes;
};
