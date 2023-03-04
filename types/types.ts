export type Candidate = {
  id: string;
  name: string;
}

export type Ballot = { id: number, ranking: Candidate[] };