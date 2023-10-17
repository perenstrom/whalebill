import { CandidateSmallId } from 'types/graph';

export const generateNodeHash = (
  results: Map<CandidateSmallId, number>,
  winners: CandidateSmallId[],
  losers: CandidateSmallId[]
) => {
  const winnerPart = winners.length ? `w%${winners.join('&')}` : '';
  const convertedResults = [...results];
  const resultPart = convertedResults.length
    ? `r%${convertedResults
        .map(([candidateId, votes]) => `${candidateId}@${votes}`)
        .join('&')}`
    : '';
  const loserPart = losers.length ? `l%${losers.join('&')}` : '';
  return [winnerPart, resultPart, loserPart].filter(Boolean).join('-');
};
