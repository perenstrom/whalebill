import { calculateResults } from './calculateResults';

describe('calculateResults', () => {
  it('Returns empty array if no more spots to fill', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 3],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 0
    };

    const result = calculateResults(conditions);

    expect(result).toEqual([]);
  });

  it('Returns empty array if no more candidates', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: [] },
        { id: 2, ranking: [] },
        { id: 3, ranking: [] },
        { id: 4, ranking: [] },
        { id: 5, ranking: [] }
      ],
      savedBallots: [],
      sortedResults: new Map(),
      candidates: new Map(),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result).toEqual([]);
  });

  it('Returns array of single winner when majority, combined with input winners', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['d'],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.winners).toEqual(['d', 'a']);
  });

  it('Resets all eliminated candidates in ballots after win', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [
        { id: 1, ranking: ['a', 'b', 'c', 'e'] },
        { id: 2, ranking: ['a', 'b', 'c', 'e'] },
        { id: 3, ranking: ['e', 'a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c', 'e'] },
        { id: 5, ranking: ['b', 'a', 'c', 'e'] },
        { id: 6, ranking: ['c', 'b', 'a', 'e'] },
        { id: 7, ranking: ['a', 'b', 'c', 'e'] }
      ],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.ballots).toEqual([
      { id: 1, ranking: ['b', 'c', 'e'] },
      { id: 2, ranking: ['b', 'c', 'e'] },
      { id: 3, ranking: ['e', 'b', 'c'] },
      { id: 4, ranking: ['b', 'c', 'e'] },
      { id: 5, ranking: ['b', 'c', 'e'] },
      { id: 6, ranking: ['c', 'b', 'e'] },
      { id: 7, ranking: ['b', 'c', 'e'] }
    ]);
  });

  it('Resets all eliminated candidates in candidate list after win', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['e', { id: 'e', name: 'E' }]
      ]),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.candidates).toEqual(
      new Map([
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['e', { id: 'e', name: 'E' }]
      ])
    );
  });

  it('Resets all losers when winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['e', { id: 'e', name: 'E' }]
      ]),
      previousWinners: [],
      previousLosers: ['asdf'],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.losers).toEqual([]);
  });

  it('Returns empty array for saved ballots when winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['e', { id: 'e', name: 'E' }]
      ]),
      previousWinners: [],
      previousLosers: ['asdf'],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedBallots).toEqual([]);
  });

  it('Returns empty array for saved candidates when winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['e', { id: 'e', name: 'E' }]
      ]),
      previousWinners: [],
      previousLosers: ['asdf'],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedCandidates).toEqual(new Map([]));
  });

  it('Decreases number of positions when a winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.positionsToFill).toEqual(1);
  });

  it('Sets all remaining candidates as losers when last winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] },
        { id: 7, ranking: ['a', 'b', 'c'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 4],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.losers).toEqual(['b', 'c']);
  });

  it('Returns array of single elimination when clear loser, combined with input losers', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.losers).toEqual(['c']);
  });

  it('Removes eliminated candidate from candidate list', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.candidates).toEqual(
      new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }]
      ])
    );
  });

  it('Passes through winners when eliminating', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.winners).toEqual(['asdf']);
  });

  it('Removes eliminated candidate from ballots', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.ballots).toEqual([
      { id: 2, ranking: ['a', 'b'] },
      { id: 3, ranking: ['a', 'b'] },
      { id: 4, ranking: ['b', 'a'] },
      { id: 5, ranking: ['b', 'a'] },
      { id: 6, ranking: ['b', 'a'] }
    ]);
  });

  it('Saves ballots for reset when eliminating', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedBallots).toEqual([
      { id: 2, ranking: ['a', 'b', 'c'] },
      { id: 3, ranking: ['a', 'b', 'c'] },
      { id: 4, ranking: ['b', 'a', 'c'] },
      { id: 5, ranking: ['b', 'a', 'c'] },
      { id: 6, ranking: ['c', 'b', 'a'] }
    ]);
  });

  it('Passes through saved ballots if they exist', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [
        { id: 2, ranking: ['a', 'b', 'c', 'e'] },
        { id: 3, ranking: ['e', 'a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c', 'e'] },
        { id: 5, ranking: ['b', 'a', 'c', 'e'] },
        { id: 6, ranking: ['c', 'b', 'a', 'e'] }
      ],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedBallots).toEqual([
      { id: 2, ranking: ['a', 'b', 'c', 'e'] },
      { id: 3, ranking: ['e', 'a', 'b', 'c'] },
      { id: 4, ranking: ['b', 'a', 'c', 'e'] },
      { id: 5, ranking: ['b', 'a', 'c', 'e'] },
      { id: 6, ranking: ['c', 'b', 'a', 'e'] }
    ]);
  });

  it('Saves candidates for reset when eliminating', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedCandidates).toEqual(
      new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ])
    );
  });

  it('Passes through saved candidates if they exist', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['d', { id: 'd', name: 'D' }]
      ]),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedCandidates).toEqual(
      new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['d', { id: 'd', name: 'D' }]
      ])
    );
  });

  it("Doesn't change positions to fill when eliminating", async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['asdf'],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.positionsToFill).toEqual(2);
  });

  it('Returns array of all possible eliminations when split bottom', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c', 'd'] },
        { id: 2, ranking: ['a', 'b', 'c', 'd'] },
        { id: 3, ranking: ['d', 'b', 'c', 'a'] },
        { id: 4, ranking: ['d', 'b', 'c', 'a'] },
        { id: 5, ranking: ['b', 'a', 'c', 'd'] },
        { id: 6, ranking: ['c', 'b', 'a', 'd'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['d', 2],
        ['b', 1],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }],
        ['d', { id: 'd', name: 'D' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['d'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(2);
    expect(result[0]?.options?.ballots).toEqual([
      { id: 1, ranking: ['a', 'c', 'd'] },
      { id: 2, ranking: ['a', 'c', 'd'] },
      { id: 3, ranking: ['d', 'c', 'a'] },
      { id: 4, ranking: ['d', 'c', 'a'] },
      { id: 5, ranking: ['a', 'c', 'd'] },
      { id: 6, ranking: ['c', 'a', 'd'] }
    ]);
    expect(result[0]?.options?.losers).toEqual(['b']);
    expect(result[1]?.options?.ballots).toEqual([
      { id: 1, ranking: ['a', 'b', 'd'] },
      { id: 2, ranking: ['a', 'b', 'd'] },
      { id: 3, ranking: ['d', 'b', 'a'] },
      { id: 4, ranking: ['d', 'b', 'a'] },
      { id: 5, ranking: ['b', 'a', 'd'] },
      { id: 6, ranking: ['b', 'a', 'd'] }
    ]);
    expect(result[1]?.options?.losers).toEqual(['c']);
  });

  it('Returns array of all possible eliminations when split bottom, three', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['b', 'a', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['c', 'a', 'b'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 2],
        ['b', 2],
        ['c', 2]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['d'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(3);
    expect(result[0]?.options?.ballots).toEqual([
      { id: 1, ranking: ['b', 'c'] },
      { id: 2, ranking: ['b', 'c'] },
      { id: 3, ranking: ['b', 'c'] },
      { id: 4, ranking: ['b', 'c'] },
      { id: 5, ranking: ['c', 'b'] },
      { id: 6, ranking: ['c', 'b'] }
    ]);
    expect(result[0]?.options?.losers).toEqual(['a']);
    expect(result[1]?.options?.ballots).toEqual([
      { id: 1, ranking: ['a', 'c'] },
      { id: 2, ranking: ['a', 'c'] },
      { id: 3, ranking: ['a', 'c'] },
      { id: 4, ranking: ['a', 'c'] },
      { id: 5, ranking: ['c', 'a'] },
      { id: 6, ranking: ['c', 'a'] }
    ]);
    expect(result[1]?.options?.losers).toEqual(['b']);
    expect(result[2]?.options?.ballots).toEqual([
      { id: 1, ranking: ['a', 'b'] },
      { id: 2, ranking: ['a', 'b'] },
      { id: 3, ranking: ['b', 'a'] },
      { id: 4, ranking: ['b', 'a'] },
      { id: 5, ranking: ['a', 'b'] },
      { id: 6, ranking: ['b', 'a'] }
    ]);
    expect(result[2]?.options?.losers).toEqual(['c']);
  });

  it('Returns options hash when returning options', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: 1, ranking: ['a', 'b', 'c'] },
        { id: 2, ranking: ['a', 'b', 'c'] },
        { id: 3, ranking: ['a', 'b', 'c'] },
        { id: 4, ranking: ['b', 'a', 'c'] },
        { id: 5, ranking: ['b', 'a', 'c'] },
        { id: 6, ranking: ['c', 'b', 'a'] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        ['a', 3],
        ['b', 2],
        ['c', 1]
      ]),
      candidates: new Map([
        ['a', { id: 'a', name: 'A' }],
        ['b', { id: 'b', name: 'B' }],
        ['c', { id: 'c', name: 'C' }]
      ]),
      savedCandidates: new Map(),
      previousWinners: ['d'],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.hash).toEqual(expect.any(String));
  });
});

export {};
