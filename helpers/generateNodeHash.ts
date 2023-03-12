export const generateNodeHash = (
  results: Map<string, number>,
  winners: string[],
  losers: string[]
) => {
  const winnerPart = winners.length ? `w%${winners.join('-')}` : '';
  const convertedResults = [...results];
  const resultPart = convertedResults.length
    ? `r%${convertedResults
        .map(([candidateId, votes]) => `${candidateId}@${votes}`)
        .join('-')}`
    : '';
  const loserPart = losers.length ? `l%${losers.join('-')}` : '';
  return [winnerPart, resultPart, loserPart].filter(Boolean).join('-');
};
