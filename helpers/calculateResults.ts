import {
  Ballot,
  CandidateId,
  CandidateMap,
  ResultHash,
  ResultNodeOptions
} from 'types/types';
import { generateOptionsHash } from './generateOptionsHash';
import { shiftBallots } from './shiftBallots';

interface ResultInput {
  ballots: Ballot[];
  savedBallots: Ballot[];
  candidates: CandidateMap;
  savedCandidates: CandidateMap;
  sortedResults: Map<CandidateId, number>;
  positionsToFill: number;
  previousWinners: CandidateId[];
  previousLosers: CandidateId[];
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
  if (firstPlace[1] !== secondPlace?.[1] && firstPlace[1] > VOTES_REQUIRED) {
    const newCandidates = new Map(savedCandidates);
    newCandidates.delete(firstPlace[0]);

    const childOptions = {
      winners: [...previousWinners, firstPlace[0]],
      losers: [],
      ballots: shiftBallots(savedBallots, firstPlace[0]),
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

    const childOptions = {
      winners: previousWinners,
      losers: [...previousLosers, lastPlace[0]],
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

  return losers.map(([loser]) => {
    const newCandidates = new Map(candidates);
    newCandidates.delete(loser);

    const newSavedBallots = savedBallots.length ? savedBallots : ballots;
    const newSavedCandidates = savedCandidates.size
      ? savedCandidates
      : candidates;

    const childOptions = {
      winners: previousWinners,
      losers: [...previousLosers, loser],
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
