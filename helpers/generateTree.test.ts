import { CandidateMap, Ballot, GraphNode } from 'types/types';
import { generateTree } from './generateTree';

describe('generateTree', () => {
  it('returns correct node list', async () => {
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

    // TODO: Keep writing this test
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
          children: []
        }
      ]
    ]);

    expect(result).toEqual(expectedTree);
  });
});
