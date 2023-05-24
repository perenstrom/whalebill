import { createHash } from 'crypto';
import { ResultNodeOptions } from 'types/graph';

export const generateOptionsHash = (options: ResultNodeOptions) => {
  const {
    ballots = [],
    candidates = new Map(),
    winners = [],
    losers = [],
    savedBallots = [],
    savedCandidates = new Map(),
    positionsToFill = 1
  } = options;

  const value = [
    `b-${ballots
      .map((ballot) => `${ballot.id}@${ballot.ranking.join('-')}`)
      .join('-')}`,
    `sb-${savedBallots
      .map((ballot) => `${ballot.id}@${ballot.ranking.join('-')}`)
      .join('-')}`,
    `c-${[...candidates].map(([id, { name }]) => `${id}@${name}`).join('-')}`,
    `sc-${[...savedCandidates]
      .map(([id, { name }]) => `${id}@${name}`)
      .join('-')}`,
    `w-${winners.join('-')}`,
    `l-${losers.join('-')}`,
    `p-${positionsToFill}`
  ].join('-');

  return createHash('md5').update(value).digest('hex');
};
