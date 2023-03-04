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
    const candidates = [
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ];

    const candidateMap = generateCandidateMap(candidates);

    for(const [id, candidate] of candidateMap){
      expect(id).toEqual(candidate.id);
    }
  });
});

export {};
