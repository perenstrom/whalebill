import {
  Ballot,
  CandidateMap,
  GraphNode,
  ResultNodeOptions
} from 'types/graph';
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
    const candidates: CandidateMap = new Map([
      [1, { id: '1', smallId: 1, name: 'Per' }],
      [2, { id: '2', smallId: 2, name: 'Jobjörn' }],
      [3, { id: '3', smallId: 3, name: 'Charlii' }]
    ]);

    const ballots: Ballot[] = [];

    const result = generateResultNode({
      ballots,
      candidates,
      losers: [],
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: '',
      results: new Map(),
      winners: [],
      losers: [],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });

  it('Returns empty node if there are no candidates', async () => {
    const candidates: CandidateMap = new Map([]);
    const ballots: Ballot[] = [
      {
        id: '1',
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
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: '',
      results: new Map(),
      winners: [],
      losers: [],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });

  it('Returns correct node if only votes', async () => {
    const candidates: CandidateMap = new Map([
      [1, { name: 'Per', id: '1', smallId: 1 }],
      [2, { name: 'Jobjörn', id: '2', smallId: 2 }],
      [3, { name: 'Charlii', id: '3', smallId: 3 }]
    ]);

    const ballots: Ballot[] = [
      {
        id: '1',
        ranking: [3, 1, 2]
      },
      {
        id: '2',
        ranking: [3, 2, 1]
      },
      {
        id: '3',
        ranking: [2, 1, 3]
      },
      {
        id: '4',
        ranking: [1, 3, 2]
      }
    ];

    const result = generateResultNode({
      ballots,
      candidates,
      losers: [],
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: 'r%3@2&2@1&1@1',
      results: new Map([
        [3, 2],
        [2, 1],
        [1, 1]
      ]),
      winners: [],
      losers: [],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });

  it('Returns correct node if votes, and winners', async () => {
    const candidates: CandidateMap = new Map([
      [1, { name: 'Per', smallId: 1, id: '1' }],
      [2, { name: 'Jobjörn', smallId: 2, id: '2' }],
      [3, { name: 'Charlii', smallId: 3, id: '3' }]
    ]);

    const ballots: Ballot[] = [
      {
        id: '1',
        ranking: [3, 1, 2]
      },
      {
        id: '2',
        ranking: [3, 2, 1]
      },
      {
        id: '3',
        ranking: [2, 1, 3]
      },
      {
        id: '4',
        ranking: [1, 3, 2]
      }
    ];

    const winners: ResultNodeOptions['winners'] = [4];

    const result = generateResultNode({
      ballots,
      candidates,
      winners,
      losers: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: 'w%4-r%3@2&2@1&1@1',
      results: new Map([
        [3, 2],
        [2, 1],
        [1, 1]
      ]),
      winners: [4],
      losers: [],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });

  it('Returns correct node if votes, and losers', async () => {
    const candidates: CandidateMap = new Map([
      [1, { name: 'Per', smallId: 1, id: '1' }],
      [2, { name: 'Jobjörn', smallId: 2, id: '2' }],
      [3, { name: 'Charlii', smallId: 3, id: '3' }]
    ]);

    const ballots: Ballot[] = [
      {
        id: '1',
        ranking: [3, 1, 2]
      },
      {
        id: '2',
        ranking: [3, 2, 1]
      },
      {
        id: '3',
        ranking: [2, 1, 3]
      },
      {
        id: '4',
        ranking: [1, 3, 2]
      }
    ];

    const losers: ResultNodeOptions['losers'] = [4];

    const result = generateResultNode({
      ballots,
      candidates,
      losers,
      winners: [],
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: 'r%3@2&2@1&1@1-l%4',
      results: new Map([
        [3, 2],
        [2, 1],
        [1, 1]
      ]),
      winners: [],
      losers: [4],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });

  it('Returns correct node if votes, winners, and losers', async () => {
    const candidates: CandidateMap = new Map([
      [1, { name: 'Per', smallId: 1, id: '1' }],
      [2, { name: 'Jobjörn', smallId: 2, id: '2' }],
      [3, { name: 'Charlii', smallId: 3, id: '3' }]
    ]);

    const ballots: Ballot[] = [
      {
        id: '1',
        ranking: [3, 1, 2]
      },
      {
        id: '2',
        ranking: [3, 2, 1]
      },
      {
        id: '3',
        ranking: [2, 1, 3]
      },
      {
        id: '4',
        ranking: [1, 3, 2]
      }
    ];

    const winners: ResultNodeOptions['winners'] = [5];
    const losers: ResultNodeOptions['losers'] = [4];

    const result = generateResultNode({
      ballots,
      candidates,
      losers,
      winners,
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: 'w%5-r%3@2&2@1&1@1-l%4',
      results: new Map([
        [3, 2],
        [2, 1],
        [1, 1]
      ]),
      winners: [5],
      losers: [4],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });

  it('Returns correct node if winners, and losers, but no votes', async () => {
    const candidates: CandidateMap = new Map([]);

    const ballots: Ballot[] = [
      {
        id: '1',
        ranking: []
      },
      {
        id: '2',
        ranking: []
      },
      {
        id: '3',
        ranking: []
      },
      {
        id: '4',
        ranking: []
      }
    ];

    const winners: ResultNodeOptions['winners'] = [5];
    const losers: ResultNodeOptions['losers'] = [4];

    const result = generateResultNode({
      ballots,
      candidates,
      losers,
      winners,
      positionsToFill: 1,
      savedBallots: [],
      savedCandidates: new Map(),
      incomingNodePercentage: 100
    });

    expect(result).toEqual({
      hash: 'w%5-l%4',
      results: new Map([]),
      winners: [5],
      losers: [4],
      children: [],
      percentageOutcome: 100
    } as GraphNode);
  });
});

export {};
