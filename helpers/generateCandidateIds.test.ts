import { Candidate } from 'types/types';
import { generateCandidateIds } from './generateCandidateIds';

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
    const candidates: Omit<Candidate, 'id'>[] = [
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ];

    const uniqueCandidates = generateCandidateIds(candidates);

    expect(uniqueCandidates).toHaveLength(3);
    uniqueCandidates.forEach((candidate) => {
      expect(candidate).toHaveProperty('id');
    });
  });
});

export {};
