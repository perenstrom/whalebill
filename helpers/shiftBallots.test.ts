import { Ballot } from 'types/graph';
import { shiftBallots } from './shiftBallots';

describe('shiftBallots', () => {
  it('Removes a candidate from all rankings', async () => {
    const ballots: Ballot[] = [
      {
        id: '1',
        ranking: [1, 2, 3]
      },
      {
        id: '2',
        ranking: [1, 3, 2]
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

    const shiftedBallots = shiftBallots(ballots, 1);

    expect(shiftedBallots).toEqual([
      {
        id: '1',
        ranking: [2, 3]
      },
      {
        id: '2',
        ranking: [3, 2]
      },
      {
        id: '3',
        ranking: [2, 3]
      },
      {
        id: '4',
        ranking: [3, 2]
      }
    ]);
  });
});

export {};
