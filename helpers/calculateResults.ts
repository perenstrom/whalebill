import {
  Ballot,
  CandidateMap,
  CandidateSmallId,
  ResultHash,
  ResultNodeOptions
} from 'types/graph';
import { generateOptionsHash } from './generateOptionsHash';
import { shiftBallots } from './shiftBallots';

interface ResultInput {
  ballots: Ballot[];
  savedBallots: Ballot[];
  candidates: CandidateMap;
  savedCandidates: CandidateMap;
  sortedResults: Map<CandidateSmallId, number>;
  positionsToFill: number;
  previousWinners: CandidateSmallId[];
  previousLosers: CandidateSmallId[];
}

export const calculateResults = (
  conditions: ResultInput
): { options: ResultNodeOptions; hash: ResultHash }[] => {
  const {
    ballots,
    savedBallots,
    candidates,
    savedCandidates,
    positionsToFill,
    sortedResults,
    previousWinners,
    previousLosers
  } = conditions;

  if (positionsToFill === 0 || candidates.size === 0) return [];

  const VOTES_REQUIRED = ballots.length / 2;
  const values = [...sortedResults];
  const firstPlace = values[0];
  const secondPlace = values[1];

  // Clear winner
  if (
    values.length === 1 ||
    (firstPlace[1] !== secondPlace?.[1] && firstPlace[1] > VOTES_REQUIRED)
  ) {
    const newPositionsToFill = positionsToFill - 1;

    const newCandidates = savedCandidates.size
      ? new Map(savedCandidates)
      : new Map(candidates);
    newCandidates.delete(firstPlace[0]);

    const newLosers =
      newPositionsToFill === 0
        ? [...newCandidates].map(([id]) => id).sort((a, b) => a - b)
        : [];

    if (newPositionsToFill === 0) {
      newCandidates.clear();
    }

    const newBallots =
      newPositionsToFill === 0
        ? []
        : shiftBallots(
            savedBallots.length ? savedBallots : ballots,
            firstPlace[0]
          );

    const childOptions: ResultNodeOptions = {
      winners: [...previousWinners, firstPlace[0]].sort((a, b) => a - b),
      losers: newLosers,
      ballots: newBallots,
      savedBallots: [],
      candidates: newCandidates,
      savedCandidates: new Map(),
      positionsToFill: positionsToFill - 1
    };

    return [
      {
        options: childOptions,
        hash: generateOptionsHash(childOptions)
      }
    ];
  }

  const lastPlace = values[values.length - 1];
  const secondToLastPlace = values[values.length - 2];

  // Clear loser
  if (secondToLastPlace && lastPlace[1] !== secondToLastPlace[1]) {
    const newCandidates = new Map(candidates);
    newCandidates.delete(lastPlace[0]);

    const newSavedBallots = savedBallots.length ? savedBallots : ballots;
    const newSavedCandidates = savedCandidates.size
      ? savedCandidates
      : candidates;

    const childOptions: ResultNodeOptions = {
      winners: previousWinners,
      losers: [...previousLosers, lastPlace[0]].sort((a, b) => a - b),
      ballots: shiftBallots(ballots, lastPlace[0]),
      savedBallots: newSavedBallots,
      candidates: newCandidates,
      savedCandidates: newSavedCandidates,
      positionsToFill: positionsToFill
    };

    return [{ options: childOptions, hash: generateOptionsHash(childOptions) }];
  }

  // Tied losers
  const lastPlaceVotes = lastPlace[1];
  const losers = [...sortedResults].filter(
    ([, votes]) => votes === lastPlaceVotes
  );
  const loserIds = losers.map(([id]) => id);

  // If all last places are tied on 0 votes, eliminate them all in batch
  if (lastPlaceVotes === 0) {
    const newCandidates = new Map(candidates);
    loserIds.forEach((loserId) => newCandidates.delete(loserId));

    const newSavedBallots = savedBallots.length ? savedBallots : ballots;
    const newSavedCandidates = savedCandidates.size
      ? savedCandidates
      : candidates;

    const shiftedBallots = loserIds.reduce(
      (accBallots, loserId) => shiftBallots(accBallots, loserId),
      ballots
    );

    const childOptions: ResultNodeOptions = {
      winners: previousWinners,
      losers: [...previousLosers, ...loserIds].sort((a, b) => a - b),
      ballots: shiftedBallots,
      savedBallots: newSavedBallots,
      candidates: newCandidates,
      savedCandidates: newSavedCandidates,
      positionsToFill: positionsToFill
    };

    return [
      {
        options: childOptions,
        hash: generateOptionsHash(childOptions)
      }
    ];
  }

  // Else, split the tree
  return losers.map(([loser]) => {
    const newCandidates = new Map(candidates);
    newCandidates.delete(loser);

    const newSavedBallots = savedBallots.length ? savedBallots : ballots;
    const newSavedCandidates = savedCandidates.size
      ? savedCandidates
      : candidates;

    const childOptions: ResultNodeOptions = {
      winners: previousWinners,
      losers: [...previousLosers, loser].sort((a, b) => a - b),
      ballots: shiftBallots(ballots, loser),
      savedBallots: newSavedBallots,
      candidates: newCandidates,
      savedCandidates: newSavedCandidates,
      positionsToFill: positionsToFill
    };

    return {
      options: childOptions,
      hash: generateOptionsHash(childOptions)
    };
  });
};
