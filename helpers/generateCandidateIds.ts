import { Candidate } from 'types/types';

export const generateCandidateIds = (
  candidates: Omit<Candidate, 'id'>[]
): Candidate[] =>
  candidates.map((candidate) => ({
    ...candidate,
    id: crypto.randomUUID().split('-')[0]
  }));
