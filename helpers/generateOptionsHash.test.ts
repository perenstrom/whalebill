import { CandidateMap, Ballot, ResultNodeOptions } from 'types/graph';
import { generateOptionsHash } from './generateOptionsHash';

describe('generateOptionsHash', () => {
  const candidates: CandidateMap = new Map([
    ['asdf', { name: 'Per', id: 'asdf' }],
    ['qwer', { name: 'Jobjörn', id: 'qwer' }]
  ]);
  const savedCandidates: CandidateMap = new Map([
    ['asdf', { name: 'Per', id: 'asdf' }],
    ['qwer', { name: 'Jobjörn', id: 'qwer' }],
    ['zxcv', { name: 'Charlii', id: 'zxcv' }]
  ]);

  const ballots: Ballot[] = [
    {
      id: 1,
      ranking: ['asdf', 'qwer']
    },
    {
      id: 2,
      ranking: ['qwer', 'asdf']
    },
    {
      id: 3,
      ranking: ['qwer', 'asdf']
    },
    {
      id: 4,
      ranking: ['asdf', 'qwer']
    }
  ];

  const savedBallots: Ballot[] = [
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

  const winners: string[] = ['tyui'];
  const losers: string[] = ['ghjk'];
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
