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

    const rankingHash = generateResultHash(result);

    expect(rankingHash).toEqual('asdf@5-qwer@2-zxcv@1');
  });
});

export {};
