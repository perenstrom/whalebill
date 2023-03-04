export const generateResultHash = (results: Map<string, number>) =>
  [...results]
    .map(([candidateId, votes]) => `${candidateId}@${votes}`)
    .join('-');
