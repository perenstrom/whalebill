import { Candidate } from 'types/types';

export const generateCandidateMap = (candidates: Candidate[]) =>
  new Map(candidates.map((candidate) => [candidate.id, candidate]));
