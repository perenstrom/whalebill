import { Candidate } from 'types/types';
import { generateRankingHash } from './generateRankingHash';

beforeAll(() => {
  const crypto = require('crypto');

  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => crypto.randomUUID()
    }
  });
});

describe('generateCandidateIds', () => {
  it('Returns a list of candidates with ids', async () => {
    const ranking: Candidate[] = [
      { name: 'Per', id: 'asdf' },
      { name: 'Jobjörn', id: 'qwer' },
      { name: 'Charlii', id: 'zxcv' }
    ];

    const rankingHash = generateRankingHash(ranking);

    expect(rankingHash).toEqual('asdf-qwer-zxcv');
  });
});

export {};
