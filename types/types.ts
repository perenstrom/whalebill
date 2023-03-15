export type CandidateId = string;
type Votes = number;

export type Candidate = {
  id: CandidateId;
  name: string;
};
export type CandidateMap = Map<CandidateId, Candidate>;

export type Ballot = { id: number; ranking: CandidateId[] };

type NodeHash = string;
export type GraphNode = {
  hash: NodeHash;
  results: Map<CandidateId, Votes>;
  winners: CandidateId[];
  losers: CandidateId[];
  children?: string[];
};

export type Graph = Map<NodeHash, GraphNode>;

export interface ResultNodeOptions {
  ballots: Ballot[];
  savedBallots?: Ballot[];
  candidates: CandidateMap;
  savedCandidates?: CandidateMap;
  winners?: CandidateId[];
  losers?: CandidateId[];
  positionsToFill?: number;
}
