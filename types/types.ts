export type CandidateId = string;
type Votes = number;

export type Candidate = {
  id: CandidateId;
  name: string;
};

export type Ballot = { id: number; ranking: CandidateId[] };

export type ResultNode = {
  hash: string;
  results: Map<CandidateId, Votes>;
  children: ResultNode[];
  totalSiblings: number;
  winners: CandidateId[] | null;
  losers: CandidateId[] | null;
};
