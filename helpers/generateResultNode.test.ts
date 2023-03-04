import { Ballot, CandidateMap } from 'types/types';
import { generateCandidateMap } from './generateCanidateMap';
import { generateResultNode } from './generateResultNode';

beforeAll(() => {
  const crypto = require('crypto');

  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => crypto.randomUUID()
    }
  });
});

describe('generateResultNode', () => {
  it('Returns undefined if there are no votes', async () => {
    const candidates = generateCandidateMap([
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ]);

    const ballots: Ballot[] = [];

    const result = generateResultNode(ballots, candidates);

    expect(result).toBeUndefined();
  });

  it('Returns two nodes with winner in second round if majority', async () => {
    const candidates: CandidateMap = new Map([
      ['asdf', { name: 'Per', id: 'asdf' }],
      ['qwer', { name: 'Jobjörn', id: 'qwer' }],
      ['zxcv', { name: 'Charlii', id: 'zxcv' }]
    ]);

    const ballots: Ballot[] = [
      {
        id: 1,
        ranking: ['zxcv', 'asdf', 'qwer']
      },
      {
        id: 2,
        ranking: ['zxcv', 'qwer', 'asdf']
      },
      {
        id: 3,
        ranking: ['qwer', 'asdf', 'zxcv']
      },
      {
        id: 4,
        ranking: ['asdf', 'zxcv', 'qwer']
      }
    ];

    const resultNode = generateResultNode(ballots, candidates);

    expect(resultNode).toEqual({
      hash: 'zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      children: [
        {
          hash: 'asdf@2-qwer@2',
          results: new Map([
            ['asdf', 2],
            ['qwer', 2]
          ]),
          children: [],
          totalSiblings: 1,
          winners: ['zxcv'],
          losers: null
        }
      ],
      totalSiblings: 1,
      winners: [],
      losers: null
    });
  });
});

export {};
