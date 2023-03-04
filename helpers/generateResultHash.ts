export const generateResultHash = (results: Map<string, number>) =>
  [...results]
    .filter(([, votes]) => votes > 0)
    .map(([candidateId, votes]) => `${candidateId}@${votes}`)
    .join('-');
