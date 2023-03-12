import {
  ResultNode,
  GraphNode,
  ResultNodeOptions
} from 'types/types';
import { generateNodeHash } from './generateNodeHash';
import { shiftBallots } from './shiftBallots';


const getEmptyGraphNode = (): GraphNode => {
  return {
    hash: '',
    results: new Map(),
    winners: [],
    losers: [],
    children: []
  };
};
export const generateResultNode2 = (options: ResultNodeOptions): GraphNode => {
  const { ballots, candidates, winners = [], losers = [] } = options;

  if (
    winners.length === 0 &&
    losers.length === 0 &&
    (ballots.length === 0 || candidates.size === 0)
  ) {
    return getEmptyGraphNode();
  }

  const candidateVotes: Map<string, number> = new Map();

  ballots.forEach((ballot) => {
    if (!ballot.ranking.length) return;

    candidateVotes.set(
      ballot.ranking[0],
      (candidateVotes.get(ballot.ranking[0]) ?? 0) + 1
    );
  });

  candidates.forEach((candidate) => {
    if (!ballots.length) return;
    if (!candidateVotes.has(candidate.id)) {
      candidateVotes.set(candidate.id, 0);
    }
  });

  const sortedResults = new Map(
    [...candidateVotes].sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
  );

  return {
    hash: generateNodeHash(sortedResults, winners, losers),
    results: sortedResults,
    winners,
    losers
  };
};

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
  const VOTES_REQUIRED = Math.ceil(ballots.length / 2);
  const candidateVotes: Map<string, number> = new Map();

  ballots.forEach((ballot) => {
    if (!ballots.length || !ballot.ranking.length) return;

    candidateVotes.set(
      ballot.ranking[0],
      (candidateVotes.get(ballot.ranking[0]) ?? 0) + 1
    );
  });

  candidates.forEach((candidate) => {
    if (!ballots.length) return;
    if (!candidateVotes.has(candidate.id)) {
      candidateVotes.set(candidate.id, 0);
    }
  });

  const sortedResults = new Map(
    [...candidateVotes].sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
  );

  const values = [...sortedResults];
  const firstPlace = values[0];
  const secondPlace = values[1];

  if (candidateVotes.size < 1 || candidates.size < 1) {
    console.log('No votes');
    return {
      hash: generateNodeHash(sortedResults, winners, losers),
      results: sortedResults,
      children: [],
      totalSiblings: 1,
      winners,
      losers
    };
  }

  // Voting over
  if (positionsToFill < 1) {
    console.log('Voting over');
    return {
      hash: generateNodeHash(sortedResults, winners, losers),
      results: sortedResults,
      children: [],
      totalSiblings: 1,
      winners,
      losers
    };
  }

  // Clear winner
  if (firstPlace[1] !== secondPlace?.[1] && firstPlace[1] >= VOTES_REQUIRED) {
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
      hash: generateNodeHash(sortedResults, winners, losers),
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
    console.log('Clear loser');
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
      hash: generateNodeHash(sortedResults, winners, losers),
      results: sortedResults,
      children: childNode ? [childNode] : [],
      totalSiblings: 1,
      winners,
      losers
    };
  }

  // Tie
  return {
    hash: generateNodeHash(sortedResults, winners, losers),
    results: sortedResults,
    children: [],
    totalSiblings: 1,
    winners,
    losers
  };
};
