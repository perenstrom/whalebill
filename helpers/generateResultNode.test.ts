import { Ballot, CandidateId, CandidateMap, GraphNode } from 'types/types';
import { generateCandidateMap } from './generateCanidateMap';
import { generateResultNode, generateResultNode2 } from './generateResultNode';
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
  it('Returns empty node if there are no votes', async () => {
    const candidates = generateCandidateMap([
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ]);

    const ballots: Ballot[] = [];

    const result = generateResultNode({ ballots, candidates });

    expect(result).toEqual({
      hash: '',
      results: new Map(),
      children: [],
      totalSiblings: 1,
      winners: [],
      losers: []
    });
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
      hash: 'r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      totalSiblings: 1,
      winners: [],
      losers: [],
      children: [
        {
          hash: 'w%zxcv-r%asdf@2-qwer@2',
          results: new Map([
            ['asdf', 2],
            ['qwer', 2]
          ]),
          totalSiblings: 1,
          winners: ['zxcv'],
          losers: [],
          children: []
        }
      ]
    });
  });

  it('Returns four result nodes if majority is reached in both cases', async () => {
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
      hash: 'r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      totalSiblings: 1,
      winners: [],
      losers: [],
      children: [
        {
          hash: 'w%zxcv-r%qwer@3-asdf@1',
          results: new Map([
            ['qwer', 3],
            ['asdf', 1]
          ]),
          totalSiblings: 1,
          winners: ['zxcv'],
          losers: [],
          children: [
            {
              hash: 'w%zxcv-qwer-r%asdf@4',
              results: new Map([['asdf', 4]]),
              totalSiblings: 1,
              winners: ['zxcv', 'qwer'],
              losers: [],
              children: [
                {
                  hash: 'w%zxcv-qwer-asdf',
                  results: new Map(),
                  children: [],
                  totalSiblings: 1,
                  winners: ['zxcv', 'qwer', 'asdf'],
                  losers: []
                }
              ]
            }
          ]
        }
      ]
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
      hash: 'r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      totalSiblings: 1,
      winners: [],
      losers: [],
      children: [
        {
          hash: 'w%zxcv-r%qwer@3-asdf@1',
          results: new Map([
            ['qwer', 3],
            ['asdf', 1]
          ]),
          children: [],
          totalSiblings: 1,
          winners: ['zxcv'],
          losers: []
        }
      ]
    });
  });

  it("Returns five result nodes eliminating the candidate with the least votes if there's no majority", async () => {
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
      hash: 'r%zxcv@2-asdf@2-qwer@1',
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
          hash: 'r%zxcv@3-asdf@2-l%qwer',
          results: new Map([
            ['zxcv', 3],
            ['asdf', 2]
          ]),
          totalSiblings: 1,
          winners: [],
          losers: ['qwer'],
          children: [
            {
              hash: 'w%zxcv-r%asdf@3-qwer@2',
              results: new Map([
                ['asdf', 3],
                ['qwer', 2]
              ]),
              totalSiblings: 1,
              winners: ['zxcv'],
              losers: [],
              children: [
                {
                  hash: 'w%zxcv-asdf-r%qwer@5',
                  results: new Map([['qwer', 5]]),
                  totalSiblings: 1,
                  winners: ['zxcv', 'asdf'],
                  losers: [],
                  children: [
                    {
                      hash: 'w%zxcv-asdf-qwer',
                      results: new Map(),
                      totalSiblings: 1,
                      winners: ['zxcv', 'asdf', 'qwer'],
                      losers: [],
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  });
});

describe('generateResultNode2', () => {
  // TODO: Add tests for generateResultNode2
  it('Returns empty node if there are no votes', async () => {
    const candidates = generateCandidateMap([
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ]);

    const ballots: Ballot[] = [];

    const result = generateResultNode2({ ballots, candidates });

    expect(result).toEqual({
      hash: '',
      results: new Map(),
      winners: [],
      losers: [],
      children: []
    } as GraphNode);
  });

  it('Returns empty node if there are no candidates', async () => {
    const candidates = generateCandidateMap([]);
    const ballots: Ballot[] = [
      {
        id: 1,
        ranking: []
      }
    ];

    const result = generateResultNode2({ ballots, candidates });

    expect(result).toEqual({
      hash: '',
      results: new Map(),
      winners: [],
      losers: [],
      children: []
    } as GraphNode);
  });

  it('Returns correct node if only votes', async () => {
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

    const result = generateResultNode2({ ballots, candidates });

    expect(result).toEqual({
      hash: 'r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: [],
      losers: []
    } as GraphNode);
  });

  it('Returns correct node if votes, and winners', async () => {
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

    const winners: CandidateId[] = ['tyui'];

    const result = generateResultNode2({ ballots, candidates, winners });

    expect(result).toEqual({
      hash: 'w%tyui-r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: ['tyui'],
      losers: []
    } as GraphNode);
  });

  it('Returns correct node if votes, and losers', async () => {
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

    const losers: CandidateId[] = ['tyui'];

    const result = generateResultNode2({ ballots, candidates, losers });

    expect(result).toEqual({
      hash: 'r%zxcv@2-qwer@1-asdf@1-l%tyui',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: [],
      losers: ['tyui']
    } as GraphNode);
  });

  it('Returns correct node if votes, winners, and losers', async () => {
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

    const winners: CandidateId[] = ['ghjk'];
    const losers: CandidateId[] = ['tyui'];

    const result = generateResultNode2({
      ballots,
      candidates,
      losers,
      winners
    });

    expect(result).toEqual({
      hash: 'w%ghjk-r%zxcv@2-qwer@1-asdf@1-l%tyui',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: ['ghjk'],
      losers: ['tyui']
    } as GraphNode);
  });

  it('Returns correct node if winners, and losers, but no votes', async () => {
    // TODO: WHY NO WORK?!
    const candidates: CandidateMap = new Map([]);

    const ballots: Ballot[] = [
      {
        id: 1,
        ranking: []
      },
      {
        id: 2,
        ranking: []
      },
      {
        id: 3,
        ranking: []
      },
      {
        id: 4,
        ranking: []
      }
    ];

    const winners: CandidateId[] = ['ghjk'];
    const losers: CandidateId[] = ['tyui'];

    const result = generateResultNode2({
      ballots,
      candidates,
      losers,
      winners
    });

    expect(result).toEqual({
      hash: 'w%ghjk-l%tyui',
      results: new Map([]),
      winners: ['ghjk'],
      losers: ['tyui']
    } as GraphNode);
  });
});

export {};
