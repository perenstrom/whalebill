import { Candidate } from 'types/types';

export const generateRankingHash = (ranking: Candidate[]) =>
  ranking.map((candidate) => candidate.id).join('-');
