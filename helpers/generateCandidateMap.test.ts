import { generateCandidateIds } from './generateCandidateIds';
import { generateCandidateMap } from './generateCanidateMap';

beforeAll(() => {
  const crypto = require('crypto');

  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => crypto.randomUUID()
    }
  });
});

describe('generateCandidateMap', () => {
  it('Returns a map of candidates', async () => {
    const candidates = generateCandidateIds([
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ]);

    const candidateMap = generateCandidateMap(candidates);

    expect(candidateMap).toEqual(
      new Map([
        [candidates[0].id, candidates[0]],
        [candidates[1].id, candidates[1]],
        [candidates[2].id, candidates[2]]
      ])
    );
  });
});

export {};
