import { Ballot, CandidateMap } from 'types/types';
import { generateCandidateMap } from './generateCanidateMap';
import { generateResultNode } from './generateResultNode';
import { renderResultNode } from './renderer';

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

    const result = generateResultNode({ ballots, candidates });

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

    const resultNode = generateResultNode({
      ballots,
      candidates,
      positionsToFill: 10
    });
    console.log(resultNode && renderResultNode(resultNode));

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
          losers: []
        }
      ],
      totalSiblings: 1,
      winners: [],
      losers: []
    });
  });

  it('Returns three result nodes if majority is reached in both cases', async () => {
    const candidates: CandidateMap = new Map([
      ['asdf', { name: 'Per', id: 'asdf' }],
      ['qwer', { name: 'Jobjörn', id: 'qwer' }],
      ['zxcv', { name: 'Charlii', id: 'zxcv' }]
    ]);

    const ballots: Ballot[] = [
      {
        id: 1,
        ranking: ['zxcv', 'qwer', 'asdf']
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

    const resultNode = generateResultNode({
      ballots,
      candidates,
      positionsToFill: 10
    });
    console.log(resultNode && renderResultNode(resultNode));

    expect(resultNode).toEqual({
      hash: 'zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      children: [
        {
          hash: 'qwer@3-asdf@1',
          results: new Map([
            ['qwer', 3],
            ['asdf', 1]
          ]),
          children: [
            {
              hash: 'asdf@4',
              results: new Map([['asdf', 4]]),
              children: [],
              totalSiblings: 1,
              winners: ['zxcv', 'qwer'],
              losers: []
            }
          ],
          totalSiblings: 1,
          winners: ['zxcv'],
          losers: []
        }
      ],
      totalSiblings: 1,
      winners: [],
      losers: []
    });
  });

  it('Returns two result nodes if majority is reached with limit', async () => {
    const candidates: CandidateMap = new Map([
      ['asdf', { name: 'Per', id: 'asdf' }],
      ['qwer', { name: 'Jobjörn', id: 'qwer' }],
      ['zxcv', { name: 'Charlii', id: 'zxcv' }]
    ]);

    const ballots: Ballot[] = [
      {
        id: 1,
        ranking: ['zxcv', 'qwer', 'asdf']
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

    const resultNode = generateResultNode({
      ballots,
      candidates,
      positionsToFill: 1
    });
    console.log(resultNode && renderResultNode(resultNode));

    expect(resultNode).toEqual({
      hash: 'zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      children: [
        {
          hash: 'qwer@3-asdf@1',
          results: new Map([
            ['qwer', 3],
            ['asdf', 1]
          ]),
          children: [],
          totalSiblings: 1,
          winners: ['zxcv'],
          losers: []
        }
      ],
      totalSiblings: 1,
      winners: [],
      losers: []
    });
  });

  it("Returns two result nodes eliminating the candidate with the least votes if there's no majority", async () => {
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
        ranking: ['asdf', 'qwer', 'zxcv']
      },
      {
        id: 4,
        ranking: ['asdf', 'zxcv', 'qwer']
      },
      {
        id: 5,
        ranking: ['qwer', 'zxcv', 'asdf']
      }
    ];

    const resultNode = generateResultNode({
      ballots,
      candidates,
      positionsToFill: 10
    });

    console.log(resultNode && renderResultNode(resultNode));

    expect(resultNode).toEqual({
      hash: 'zxcv@2-asdf@2-qwer@1',
      results: new Map([
        ['zxcv', 2],
        ['asdf', 2],
        ['qwer', 1]
      ]),
      totalSiblings: 1,
      winners: [],
      losers: [],
      children: [
        {
          hash: 'zxcv@3-asdf@2',
          results: new Map([
            ['zxcv', 3],
            ['asdf', 2]
          ]),
          totalSiblings: 1,
          winners: [],
          losers: ['qwer'],
          children: [
            {
              hash: 'asdf@3-qwer@2',
              results: new Map([
                ['asdf', 3],
                ['qwer', 2]
              ]),
              totalSiblings: 1,
              winners: ['zxcv'],
              losers: [],
              children: [
                {
                  hash: 'qwer@5',
                  results: new Map([['qwer', 5]]),
                  totalSiblings: 1,
                  winners: ['zxcv', 'asdf'],
                  losers: [],
                  children: []
                }
              ]
            }
          ]
        }
      ]
    });
  });
});

export {};
