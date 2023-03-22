import { CandidateMap, Ballot, GraphNode } from 'types/types';
import { generateTree } from './generateTree';

describe('generateTree', () => {
  it('returns correct node list with majority winners', async () => {
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
      },
      {
        id: 5,
        ranking: ['zxcv', 'asdf', 'qwer']
      }
    ];

    const result = generateTree({
      ballots,
      candidates,
      positionsToFill: 1
    });

    const expectedTree: Map<string, GraphNode> = new Map([
      [
        'r%zxcv@3-qwer@1-asdf@1',
        {
          hash: 'r%zxcv@3-qwer@1-asdf@1',
          results: new Map([
            ['zxcv', 3],
            ['qwer', 1],
            ['asdf', 1]
          ]),
          winners: [],
          losers: [],
          children: ['w%zxcv-l%asdf-qwer']
        }
      ],
      [
        'w%zxcv-l%asdf-qwer',
        {
          hash: 'w%zxcv-l%asdf-qwer',
          results: new Map(),
          winners: ['zxcv'],
          losers: ['asdf', 'qwer'],
          children: []
        }
      ]
    ]);

    expect(result).toEqual(expectedTree);

    const result2 = generateTree({
      ballots,
      candidates,
      positionsToFill: 2
    });

    const expectedTree2: Map<string, GraphNode> = new Map([
      [
        'r%zxcv@3-qwer@1-asdf@1',
        {
          hash: 'r%zxcv@3-qwer@1-asdf@1',
          results: new Map([
            ['zxcv', 3],
            ['qwer', 1],
            ['asdf', 1]
          ]),
          winners: [],
          losers: [],
          children: ['w%zxcv-r%asdf@3-qwer@2']
        }
      ],
      [
        'w%zxcv-r%asdf@3-qwer@2',
        {
          hash: 'w%zxcv-r%asdf@3-qwer@2',
          results: new Map([
            ['asdf', 3],
            ['qwer', 2]
          ]),
          winners: ['zxcv'],
          losers: [],
          children: ['w%asdf-zxcv-l%qwer']
        }
      ],
      [
        'w%asdf-zxcv-l%qwer',
        {
          hash: 'w%asdf-zxcv-l%qwer',
          results: new Map(),
          winners: ['asdf', 'zxcv'],
          losers: ['qwer'],
          children: []
        }
      ]
    ]);

    expect(result2).toEqual(expectedTree2);
  });

  it('returns correct node list with split branches', async () => {
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

    const result = generateTree({
      ballots,
      candidates,
      positionsToFill: 1
    });

    const expectedTree: Map<string, GraphNode> = new Map([
      [
        'r%zxcv@2-qwer@1-asdf@1',
        {
          hash: 'r%zxcv@2-qwer@1-asdf@1',
          results: new Map([
            ['zxcv', 2],
            ['qwer', 1],
            ['asdf', 1]
          ]),
          winners: [],
          losers: [],
          children: ['r%zxcv@2-asdf@2-l%qwer', 'r%zxcv@3-qwer@1-l%asdf']
        }
      ],
      [
        // 1
        'r%zxcv@2-asdf@2-l%qwer',
        {
          hash: 'r%zxcv@2-asdf@2-l%qwer',
          results: new Map([
            ['zxcv', 2],
            ['asdf', 2]
          ]),
          winners: [],
          losers: ['qwer'],
          children: ['r%asdf@4-l%qwer-zxcv', 'r%zxcv@4-l%asdf-qwer']
        }
      ],
      [
        // 2
        'r%zxcv@3-qwer@1-l%asdf',
        {
          hash: 'r%zxcv@3-qwer@1-l%asdf',
          results: new Map([
            ['zxcv', 3],
            ['qwer', 1]
          ]),
          winners: [],
          losers: ['asdf'],
          children: ['w%zxcv-l%asdf-qwer']
        }
      ],
      [
        // barn 1-1
        // 3
        'r%asdf@4-l%qwer-zxcv',
        {
          hash: 'r%asdf@4-l%qwer-zxcv',
          results: new Map([['asdf', 4]]),
          winners: [],
          losers: ['qwer', 'zxcv'],
          children: ['w%asdf-l%qwer-zxcv']
        }
      ],
      [
        // barn 1-2
        // 4
        'r%zxcv@4-l%asdf-qwer',
        {
          hash: 'r%zxcv@4-l%asdf-qwer',
          results: new Map([['zxcv', 4]]),
          winners: [],
          losers: ['asdf', 'qwer' ],
          children: ['w%zxcv-l%asdf-qwer']
        }
      ],
      [
        // barn 2-1
        // 5
        // leaf
        'w%zxcv-l%asdf-qwer',
        {
          hash: 'w%zxcv-l%asdf-qwer',
          results: new Map(),
          winners: ['zxcv'],
          losers: ['asdf', 'qwer'],
          children: []
        }
      ],
      [
        // barn 3-1
        // 6
        // leaf
        'w%asdf-l%qwer-zxcv',
        {
          hash: 'w%asdf-l%qwer-zxcv',
          results: new Map(),
          winners: ['asdf'],
          losers: ['qwer', 'zxcv'],
          children: []
        }
      ]
    ]);

    expect(result).toEqual(expectedTree);
  });
});
