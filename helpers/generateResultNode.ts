import { Ballot, ResultNode, CandidateMap, CandidateId } from 'types/types';
import { generateResultHash } from './generateResultHash';
import { shiftBallots } from './shiftBallots';

export const generateResultNode = (
  ballots: Ballot[],
  candidates: CandidateMap,
  winners: CandidateId[] = []
): ResultNode | undefined => {
  console.log(ballots);
  const VOTES_REQUIRED = Math.ceil(ballots.length / 2);
  const candidateVotes: Map<string, number> = new Map();

  ballots.forEach((ballot) => {
    candidateVotes.set(
      ballot.ranking[0],
      (candidateVotes.get(ballot.ranking[0]) ?? 0) + 1
    );
  });

  if (candidateVotes.size < 1) {
    console.log('No votes');
    return;
  }

  candidates.forEach((candidate) => {
    if (!candidateVotes.has(candidate.id)) {
      candidateVotes.set(candidate.id, 0);
    }
  });

  const sortedResults = new Map(
    [...candidateVotes].sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
  );

  const values = sortedResults.entries();

  const firstPlace = values.next().value as [string, number];
  const secondPlace = values.next().value as [string, number];

  if (firstPlace[1] === secondPlace[1]) {
    console.log('tie');
    return {
      hash: generateResultHash(sortedResults),
      results: sortedResults,
      children: [],
      totalSiblings: 1,
      winners,
      losers: null
    };
  }

  if (firstPlace[1] >= VOTES_REQUIRED) {
    const newCandidates = new Map(candidates);
    newCandidates.delete(firstPlace[0]);

    const childNode = generateResultNode(
      shiftBallots(ballots, firstPlace[0]),
      newCandidates,
      [firstPlace[0]]
    );

    return {
      hash: generateResultHash(sortedResults),
      results: sortedResults,
      children: childNode ? [childNode] : [],
      totalSiblings: 1,
      winners,
      losers: null
    };
  }

  return;
};
