import { generateNodeHash } from './generateNodeHash';

beforeAll(() => {
  const crypto = require('crypto');

  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => crypto.randomUUID()
    }
  });
});

describe('generateNodeHash', () => {
  it('Returns a string uniquely identifying a list of candidates with votes', async () => {
    const result: Parameters<typeof generateNodeHash>[0] = new Map([
      [1, 5],
      [2, 2],
      [3, 1]
    ]);

    const winners1: Parameters<typeof generateNodeHash>[1] = [4];
    const winners2: Parameters<typeof generateNodeHash>[1] = [];
    const winners3: Parameters<typeof generateNodeHash>[1] = [4];
    const winners4: Parameters<typeof generateNodeHash>[1] = [];

    const losers1: Parameters<typeof generateNodeHash>[2] = [];
    const losers2: Parameters<typeof generateNodeHash>[2] = [4];
    const losers3: Parameters<typeof generateNodeHash>[2] = [4];
    const losers4: Parameters<typeof generateNodeHash>[2] = [];

    const rankingHash1 = generateNodeHash(result, winners1, losers1);
    const rankingHash2 = generateNodeHash(result, winners2, losers2);
    const rankingHash3 = generateNodeHash(result, winners3, losers3);
    const rankingHash4 = generateNodeHash(result, winners4, losers4);

    expect(rankingHash1).toEqual('w%4-r%1@5&2@2&3@1');
    expect(rankingHash2).toEqual('r%1@5&2@2&3@1-l%4');
    expect(rankingHash3).toEqual('w%4-r%1@5&2@2&3@1-l%4');
    expect(rankingHash4).toEqual('r%1@5&2@2&3@1');
  });

  it('Returns a string uniquely identifying a list of candidates with votes, with 0s', async () => {
    const result: Parameters<typeof generateNodeHash>[0] = new Map([
      [1, 5],
      [2, 2],
      [3, 0]
    ]);

    const rankingHash = generateNodeHash(result, [], []);

    expect(rankingHash).toEqual('r%1@5&2@2&3@0');
  });
});

export {};
