import { Ballot, ResultNode, CandidateMap, CandidateId } from 'types/types';
import { generateResultHash } from './generateResultHash';
import { shiftBallots } from './shiftBallots';

interface ResultNodeOptions {
  ballots: Ballot[];
  candidates: CandidateMap;
  winners?: CandidateId[];
  positionsToFill?: number;
}
export const generateResultNode = (
  options: ResultNodeOptions
): ResultNode | undefined => {
  const { ballots, candidates, winners = [], positionsToFill = 1 } = options;
  const VOTES_REQUIRED = Math.ceil(ballots.length / 2);
  const candidateVotes: Map<string, number> = new Map();

  ballots.forEach((ballot) => {
    candidateVotes.set(
      ballot.ranking[0],
      (candidateVotes.get(ballot.ranking[0]) ?? 0) + 1
    );
  });

  if (candidateVotes.size < 1 || candidates.size < 1) {
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

  if (
    (secondPlace && firstPlace[1] === secondPlace[1]) ||
    positionsToFill === 0
  ) {
    // Tie
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

    const childNode = generateResultNode({
      ballots: shiftBallots(ballots, firstPlace[0]),
      candidates: newCandidates,
      winners: [...winners, firstPlace[0]],
      positionsToFill: positionsToFill - 1
    });

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
