import { Candidate } from 'types/graph';

export const generateCandidateMap = (
  candidates: Omit<Candidate, 'id'>[]
): Map<string, Candidate> =>
  new Map(
    candidates.map((candidate) => {
      const id = crypto.randomUUID().split('-')[0];
      return [id, { ...candidate, id }];
    })
  );
