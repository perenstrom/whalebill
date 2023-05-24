import { Ballot, CandidateId, CandidateMap, GraphNode } from 'types/graph';
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
  it('Returns empty node if there are no votes', async () => {
    const candidates = generateCandidateMap([
      { name: 'Per' },
      { name: 'Jobjörn' },
      { name: 'Charlii' }
    ]);

    const ballots: Ballot[] = [];

    const result = generateResultNode({
      ballots,
      candidates,
      losers: [],
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map()
    });

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

    const result = generateResultNode({
      ballots,
      candidates,
      losers: [],
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map()
    });

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

    const result = generateResultNode({
      ballots,
      candidates,
      losers: [],
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map()
    });

    expect(result).toEqual({
      hash: 'r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: [],
      losers: [],
      children: []
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

    const result = generateResultNode({
      ballots,
      candidates,
      winners,
      losers: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map()
    });

    expect(result).toEqual({
      hash: 'w%tyui-r%zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: ['tyui'],
      losers: [],
      children: []
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

    const result = generateResultNode({
      ballots,
      candidates,
      losers,
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map()
    });

    expect(result).toEqual({
      hash: 'r%zxcv@2-qwer@1-asdf@1-l%tyui',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: [],
      losers: ['tyui'],
      children: []
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

    const result = generateResultNode({
      ballots,
      candidates,
      losers,
      winners,
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map()
    });

    expect(result).toEqual({
      hash: 'w%ghjk-r%zxcv@2-qwer@1-asdf@1-l%tyui',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      winners: ['ghjk'],
      losers: ['tyui'],
      children: []
    } as GraphNode);
  });

  it('Returns correct node if winners, and losers, but no votes', async () => {
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

    const result = generateResultNode({
      ballots,
      candidates,
      losers,
      winners,
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
    });

    expect(result).toEqual({
      hash: 'w%ghjk-l%tyui',
      results: new Map([]),
      winners: ['ghjk'],
      losers: ['tyui'],
      children: []
    } as GraphNode);
  });
});

export {};
