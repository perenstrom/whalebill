import { CandidateMap, Ballot, ResultNodeOptions } from 'types/graph';
import { generateOptionsHash } from './generateOptionsHash';

describe('generateOptionsHash', () => {
  const candidates: CandidateMap = new Map([
    [1, { name: 'Per', id: '1', smallId: 1 }],
    [2, { name: 'Jobjörn', id: '2', smallId: 2 }]
  ]);
  const savedCandidates: CandidateMap = new Map([
    [1, { name: 'Per', id: '1', smallId: 1 }],
    [2, { name: 'Jobjörn', id: '2', smallId: 2 }],
    [3, { name: 'Charlii', id: '3', smallId: 3 }]
  ]);

  const ballots: Ballot[] = [
    {
      id: '1',
      ranking: [1, 2]
    },
    {
      id: '2',
      ranking: [2, 1]
    },
    {
      id: '3',
      ranking: [2, 1]
    },
    {
      id: '4',
      ranking: [1, 2]
    }
  ];

  const savedBallots: Ballot[] = [
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
  const losers: ResultNodeOptions['winners'] = [5];
  const positionsToFill = 5;

  const options: ResultNodeOptions = {
    ballots,
    candidates,
    savedBallots,
    savedCandidates,
    winners,
    losers,
    positionsToFill
  };

  it('Is a non-empty string', async () => {
    expect(generateOptionsHash(options)).toEqual(expect.any(String));
    expect(generateOptionsHash(options)).not.toEqual('');
  });

  it('Is idempotent', async () => {
    expect(generateOptionsHash(options)).toEqual(generateOptionsHash(options));
  });
});

export {};
