import { Ballot } from 'types/graph';
import { shiftBallots } from './shiftBallots';

describe('shiftBallots', () => {
  it('Removes a candidate from all rankings', async () => {
    const ballots: Ballot[] = [
      {
        id: 1,
        ranking: ['asdf', 'qwer', 'zxcv']
      },
      {
        id: 2,
        ranking: ['asdf', 'zxcv', 'qwer']
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

    const shiftedBallots = shiftBallots(ballots, 'asdf');

    expect(shiftedBallots).toEqual([
      {
        id: 1,
        ranking: ['qwer', 'zxcv']
      },
      {
        id: 2,
        ranking: ['zxcv', 'qwer']
      },
      {
        id: 3,
        ranking: ['qwer', 'zxcv']
      },
      {
        id: 4,
        ranking: ['zxcv', 'qwer']
      }
    ]);
  });
});

export {};
