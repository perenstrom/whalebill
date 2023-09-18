export type CandidateId = string;
type Votes = number;

export type Candidate = {
  id: CandidateId;
  name: string;
};
export type CandidateMap = Map<CandidateId, Candidate>;
export type SimpleCandidateMap = [CandidateId, Candidate][];

export type Ballot = { id: string; ranking: CandidateId[] };

export type NodeHash = string;
export type GraphNode = {
  hash: NodeHash;
  results: Map<CandidateId, Votes>;
  winners: CandidateId[];
  losers: CandidateId[];
  children: string[];
  percentageOutcome: number;
};
export type SimpleGraphNode = Omit<GraphNode, 'results'> & {
  results: [CandidateId, Votes][];
};

export type Graph = Map<NodeHash, GraphNode>;

export type ResultHash = string;
export interface ResultNodeOptions {
  ballots: Ballot[];
  savedBallots: Ballot[];
  candidates: CandidateMap;
  savedCandidates: CandidateMap;
  winners: CandidateId[];
  losers: CandidateId[];
  incomingNodePercentage: number;
  positionsToFill: number;
}
