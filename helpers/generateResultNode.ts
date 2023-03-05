import { Ballot, ResultNode, CandidateMap, CandidateId } from 'types/types';
import { generateResultHash } from './generateResultHash';
import { shiftBallots } from './shiftBallots';

interface ResultNodeOptions {
  ballots: Ballot[];
  savedBallots?: Ballot[];
  candidates: CandidateMap;
  savedCandidates?: CandidateMap;
  winners?: CandidateId[];
  losers?: CandidateId[];
  positionsToFill?: number;
}
export const generateResultNode = (
  options: ResultNodeOptions
): ResultNode | undefined => {
  const {
    ballots,
    savedBallots = ballots,
    candidates,
    savedCandidates = candidates,
    winners = [],
    losers = [],
    positionsToFill = 1
  } = options;
  console.log(ballots);
  console.log(candidates);
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

  console.log(sortedResults);

  const values = [...sortedResults];
  const firstPlace = values[0];
  const secondPlace = values[1];

  // Voting over
  if (positionsToFill < 1) {
    console.log('Voting over');
    return {
      hash: generateResultHash(sortedResults),
      results: sortedResults,
      children: [],
      totalSiblings: 1,
      winners,
      losers
    };
  }

  // Clear winner
  if (
    firstPlace[1] !== secondPlace?.[1] &&
    firstPlace[1] >= VOTES_REQUIRED
  ) {
    console.log('Clear winner');
    const newCandidates = new Map(savedCandidates);
    newCandidates.delete(firstPlace[0]);

    const childNode = generateResultNode({
      ballots: shiftBallots(savedBallots, firstPlace[0]),
      candidates: newCandidates,
      winners: [...winners, firstPlace[0]],
      losers: [],
      positionsToFill: positionsToFill - 1
    });

    return {
      hash: generateResultHash(sortedResults),
      results: sortedResults,
      children: childNode ? [childNode] : [],
      totalSiblings: 1,
      winners,
      losers
    };
  }

  const lastPlace = values[values.length - 1];
  const secondToLastPlace = values[values.length - 2];

  // Clear loser
  if (secondToLastPlace && lastPlace[1] !== secondToLastPlace[1]) {
    console.log("Clear loser");
    const newCandidates = new Map(candidates);
    newCandidates.delete(lastPlace[0]);

    const childNode = generateResultNode({
      ballots: shiftBallots(ballots, lastPlace[0]),
      savedBallots: ballots,
      candidates: newCandidates,
      savedCandidates: candidates,
      winners,
      losers: [...losers, lastPlace[0]],
      positionsToFill: positionsToFill
    });

    return {
      hash: generateResultHash(sortedResults),
      results: sortedResults,
      children: childNode ? [childNode] : [],
      totalSiblings: 1,
      winners,
      losers
    };
  }

  // Tie
  return {
    hash: generateResultHash(sortedResults),
    results: sortedResults,
    children: [],
    totalSiblings: 1,
    winners,
    losers
  };
};
