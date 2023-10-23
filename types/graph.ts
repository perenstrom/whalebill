import { GraphNode } from 'components/GraphNode';

export type CandidateId = string;
export type CandidateSmallId = number;
type Votes = number;

export type Candidate = {
  id: CandidateId;
  smallId: number;
  name: string;
};
export type CandidateMap = Map<CandidateSmallId, Candidate>;
export type SimpleCandidateMap = [CandidateSmallId, Candidate][];

export type Ballot = { id: string; ranking: CandidateSmallId[] };

export type NodeHash = string;
export type GraphNode = {
  hash: NodeHash;
  results: Map<CandidateSmallId, Votes>;
  winners: CandidateSmallId[];
  losers: CandidateSmallId[];
  children: string[];
  percentageOutcome: number;
  isLeaf?: boolean;
};
export type SimpleGraphNode = Omit<GraphNode, 'results'> & {
  results: [CandidateSmallId, Votes][];
};

export interface GraphNodeData {
  type: 'graphNode';
  node: SimpleGraphNode;
}

export interface OverflowData {
  type: 'overflow';
}

export const isGraphNodeData = (
  data: GraphNodeData | OverflowData
): data is GraphNodeData => data.type === 'graphNode';

export const isOverflowData = (
  data: GraphNodeData | OverflowData
): data is OverflowData => data.type === 'overflow';

export type Graph = Map<NodeHash, GraphNode>;

export type ResultHash = string;
export interface ResultNodeOptions {
  ballots: Ballot[];
  savedBallots: Ballot[];
  candidates: CandidateMap;
  savedCandidates: CandidateMap;
  winners: CandidateSmallId[];
  losers: CandidateSmallId[];
  positionsToFill: number;
}
