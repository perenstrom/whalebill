import { Ballot, ResultNode, CandidateMap } from 'types/types';
import { generateResultHash } from './generateResultHash';

export const generateResultNode = (
  ballots: Ballot[],
  candidates: CandidateMap
): ResultNode | null => {
  const VOTES_REQUIRED = Math.ceil(ballots.length / 2);
  const tempCandidates: Map<string, number> = new Map();

  ballots.forEach((ballot) => {
    tempCandidates.set(
      ballot.ranking[0],
      (tempCandidates.get(ballot.ranking[0]) ?? 0) + 1
    );
  });

  candidates.forEach((candidate) => {
    if (!tempCandidates.has(candidate.id)) {
      tempCandidates.set(candidate.id, 0);
    }
  });

  if (tempCandidates.size < 1) {
    console.log('No votes');
    return null;
  }

  const sortedResults = new Map(
    [...tempCandidates].sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
  );

  const values = sortedResults.entries();

  const firstPlace = values.next().value as [string, number];
  const secondPlace = values.next().value as [string, number];

  if (firstPlace[1] === secondPlace[1]) {
    console.log('tie');
    return null;
  }

  if (firstPlace[1] >= VOTES_REQUIRED) {
    return {
      hash: generateResultHash(sortedResults),
      results: sortedResults,
      children: [],
      totalSiblings: 1,
      winners: [firstPlace[0]],
      losers: null
    };
  }

  return null;
};
