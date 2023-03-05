import { generateResultHash } from './generateResultHash';

beforeAll(() => {
  const crypto = require('crypto');

  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => crypto.randomUUID()
    }
  });
});

describe('generateResultHash', () => {
  it('Returns a string uniquely identifying a list of candidates with votes', async () => {
    const result: Map<string, number> = new Map([
      ['asdf', 5],
      ['qwer', 2],
      ['zxcv', 1]
    ]);

    const winners1 = ['tyui'];
    const winners2: string[] = [];
    const winners3 = ['tyui'];
    const winners4: string[] = [];

    const losers1: string[] = [];
    const losers2 = ['tyui'];
    const losers3 = ['tyui'];
    const losers4: string[] = [];

    const rankingHash1 = generateResultHash(result, winners1, losers1);
    const rankingHash2 = generateResultHash(result, winners2, losers2);
    const rankingHash3 = generateResultHash(result, winners3, losers3);
    const rankingHash4 = generateResultHash(result, winners4, losers4);

    expect(rankingHash1).toEqual('w%tyui-r%asdf@5-qwer@2-zxcv@1');
    expect(rankingHash2).toEqual('r%asdf@5-qwer@2-zxcv@1-l%tyui');
    expect(rankingHash3).toEqual('w%tyui-r%asdf@5-qwer@2-zxcv@1-l%tyui');
    expect(rankingHash4).toEqual('r%asdf@5-qwer@2-zxcv@1');
  });

  it('Returns a string uniquely identifying a list of candidates with votes, with 0s', async () => {
    const result: Map<string, number> = new Map([
      ['asdf', 5],
      ['qwer', 2],
      ['zxcv', 0]
    ]);

    const rankingHash = generateResultHash(result, [], []);

    expect(rankingHash).toEqual('r%asdf@5-qwer@2-zxcv@0');
  });
});

export {};
