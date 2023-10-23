import { calculateResults } from './calculateResults';

const getCandidates = () =>
  new Map([
    [1, { id: '1', name: '1', smallId: 1 }],
    [2, { id: '2', name: '2', smallId: 2 }],
    [3, { id: '3', name: '3', smallId: 3 }]
  ]);

const getSavedCandidates = () =>
  new Map([
    [1, { id: '1', name: '1', smallId: 1 }],
    [2, { id: '2', name: '2', smallId: 2 }],
    [3, { id: '3', name: '3', smallId: 3 }],
    [5, { id: '5', name: '5', smallId: 5 }]
  ]);

describe('calculateResults', () => {
  it('Returns empty array if no more spots to fill', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 3],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
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
        { id: '1', ranking: [] },
        { id: '2', ranking: [] },
        { id: '3', ranking: [] },
        { id: '4', ranking: [] },
        { id: '5', ranking: [] }
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
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: new Map([
        [1, { id: '1', name: '1', smallId: 1 }],
        [2, { id: '2', name: '2', smallId: 2 }],
        [3, { id: '3', name: '3', smallId: 3 }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [4],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.winners).toEqual([1, 4]);
  });

  it('Resets all eliminated candidates in ballots after win', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [
        { id: '1', ranking: [1, 2, 3, 5] },
        { id: '2', ranking: [1, 2, 3, 5] },
        { id: '3', ranking: [5, 1, 2, 3] },
        { id: '4', ranking: [2, 1, 3, 5] },
        { id: '5', ranking: [2, 1, 3, 5] },
        { id: '6', ranking: [3, 2, 1, 5] },
        { id: '7', ranking: [1, 2, 3, 5] }
      ],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.ballots).toEqual([
      { id: '1', ranking: [2, 3, 5] },
      { id: '2', ranking: [2, 3, 5] },
      { id: '3', ranking: [5, 2, 3] },
      { id: '4', ranking: [2, 3, 5] },
      { id: '5', ranking: [2, 3, 5] },
      { id: '6', ranking: [3, 2, 5] },
      { id: '7', ranking: [2, 3, 5] }
    ]);
  });

  it('Resets all eliminated candidates in candidate list after win', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: getSavedCandidates(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.candidates).toEqual(
      new Map([
        [2, { id: '2', name: '2', smallId: 2 }],
        [3, { id: '3', name: '3', smallId: 3 }],
        [5, { id: '5', name: '5', smallId: 5 }]
      ])
    );
  });

  it('Resets all losers when winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: getSavedCandidates(),
      previousWinners: [],
      previousLosers: [9],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.losers).toEqual([]);
  });

  it('Returns empty array for saved ballots when winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: getSavedCandidates(),
      previousWinners: [],
      previousLosers: [9],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedBallots).toEqual([]);
  });

  it('Returns empty array for saved candidates when winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: getSavedCandidates(),
      previousWinners: [],
      previousLosers: [9],
      positionsToFill: 2
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedCandidates).toEqual(new Map([]));
  });

  it('Decreases number of positions when a winner is selected', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
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
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] },
        { id: '7', ranking: [1, 2, 3] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 4],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.losers).toEqual([2, 3]);
  });

  it('Returns array of single elimination when clear loser, combined with input losers', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.losers).toEqual([3]);
  });

  it('Removes eliminated candidate from candidate list', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.candidates).toEqual(
      new Map([
        [1, { id: '1', name: '1', smallId: 1 }],
        [2, { id: '2', name: '2', smallId: 2 }]
      ])
    );
  });

  it('Passes through winners when eliminating', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [9],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.winners).toEqual([9]);
  });

  it('Removes eliminated candidate from ballots', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [9],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.ballots).toEqual([
      { id: '2', ranking: [1, 2] },
      { id: '3', ranking: [1, 2] },
      { id: '4', ranking: [2, 1] },
      { id: '5', ranking: [2, 1] },
      { id: '6', ranking: [2, 1] }
    ]);
  });

  it('Saves ballots for reset when eliminating', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [9],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedBallots).toEqual([
      { id: '2', ranking: [1, 2, 3] },
      { id: '3', ranking: [1, 2, 3] },
      { id: '4', ranking: [2, 1, 3] },
      { id: '5', ranking: [2, 1, 3] },
      { id: '6', ranking: [3, 2, 1] }
    ]);
  });

  it('Passes through saved ballots if they exist', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [
        { id: '2', ranking: [1, 2, 3, 5] },
        { id: '3', ranking: [5, 1, 2, 3] },
        { id: '4', ranking: [2, 1, 3, 5] },
        { id: '5', ranking: [2, 1, 3, 5] },
        { id: '6', ranking: [3, 2, 1, 5] }
      ],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [9],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedBallots).toEqual([
      { id: '2', ranking: [1, 2, 3, 5] },
      { id: '3', ranking: [5, 1, 2, 3] },
      { id: '4', ranking: [2, 1, 3, 5] },
      { id: '5', ranking: [2, 1, 3, 5] },
      { id: '6', ranking: [3, 2, 1, 5] }
    ]);
  });

  it('Saves candidates for reset when eliminating', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [9],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedCandidates).toEqual(getCandidates());
  });

  it('Passes through saved candidates if they exist', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map([
        [1, { id: '1', name: '1', smallId: 1 }],
        [2, { id: '2', name: '2', smallId: 2 }],
        [3, { id: '3', name: '3', smallId: 3 }],
        [4, { id: '4', name: '4', smallId: 4 }]
      ]),
      previousWinners: [9],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.options?.savedCandidates).toEqual(
      new Map([
        [1, { id: '1', name: '1', smallId: 1 }],
        [2, { id: '2', name: '2', smallId: 2 }],
        [3, { id: '3', name: '3', smallId: 3 }],
        [4, { id: '4', name: '4', smallId: 4 }]
      ])
    );
  });

  it("Doesn't change positions to fill when eliminating", async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [9],
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
        { id: '1', ranking: [1, 2, 3, 4] },
        { id: '2', ranking: [1, 2, 3, 4] },
        { id: '3', ranking: [4, 2, 3, 1] },
        { id: '4', ranking: [4, 2, 3, 1] },
        { id: '5', ranking: [2, 1, 3, 4] },
        { id: '6', ranking: [3, 2, 1, 4] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [4, 2],
        [2, 1],
        [3, 1]
      ]),
      candidates: new Map([
        [1, { id: '1', name: '1', smallId: 1 }],
        [2, { id: '2', name: '2', smallId: 2 }],
        [3, { id: '3', name: '3', smallId: 3 }],
        [4, { id: '4', name: '4', smallId: 4 }]
      ]),
      savedCandidates: new Map(),
      previousWinners: [4],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(2);
    expect(result[0]?.options?.ballots).toEqual([
      { id: '1', ranking: [1, 3, 4] },
      { id: '2', ranking: [1, 3, 4] },
      { id: '3', ranking: [4, 3, 1] },
      { id: '4', ranking: [4, 3, 1] },
      { id: '5', ranking: [1, 3, 4] },
      { id: '6', ranking: [3, 1, 4] }
    ]);
    expect(result[0]?.options?.losers).toEqual([2]);
    expect(result[1]?.options?.ballots).toEqual([
      { id: '1', ranking: [1, 2, 4] },
      { id: '2', ranking: [1, 2, 4] },
      { id: '3', ranking: [4, 2, 1] },
      { id: '4', ranking: [4, 2, 1] },
      { id: '5', ranking: [2, 1, 4] },
      { id: '6', ranking: [2, 1, 4] }
    ]);
    expect(result[1]?.options?.losers).toEqual([3]);
  });

  it('Returns array of all possible eliminations when split bottom, three', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [2, 1, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [3, 1, 2] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 2],
        [2, 2],
        [3, 2]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [4],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(3);
    expect(result[0]?.options?.ballots).toEqual([
      { id: '1', ranking: [2, 3] },
      { id: '2', ranking: [2, 3] },
      { id: '3', ranking: [2, 3] },
      { id: '4', ranking: [2, 3] },
      { id: '5', ranking: [3, 2] },
      { id: '6', ranking: [3, 2] }
    ]);
    expect(result[0]?.options?.losers).toEqual([1]);
    expect(result[1]?.options?.ballots).toEqual([
      { id: '1', ranking: [1, 3] },
      { id: '2', ranking: [1, 3] },
      { id: '3', ranking: [1, 3] },
      { id: '4', ranking: [1, 3] },
      { id: '5', ranking: [3, 1] },
      { id: '6', ranking: [3, 1] }
    ]);
    expect(result[1]?.options?.losers).toEqual([2]);
    expect(result[2]?.options?.ballots).toEqual([
      { id: '1', ranking: [1, 2] },
      { id: '2', ranking: [1, 2] },
      { id: '3', ranking: [2, 1] },
      { id: '4', ranking: [2, 1] },
      { id: '5', ranking: [1, 2] },
      { id: '6', ranking: [2, 1] }
    ]);
    expect(result[2]?.options?.losers).toEqual([3]);
  });

  it('Returns options hash when returning options', async () => {
    const conditions: Parameters<typeof calculateResults>[0] = {
      ballots: [
        { id: '1', ranking: [1, 2, 3] },
        { id: '2', ranking: [1, 2, 3] },
        { id: '3', ranking: [1, 2, 3] },
        { id: '4', ranking: [2, 1, 3] },
        { id: '5', ranking: [2, 1, 3] },
        { id: '6', ranking: [3, 2, 1] }
      ],
      savedBallots: [],
      sortedResults: new Map([
        [1, 3],
        [2, 2],
        [3, 1]
      ]),
      candidates: getCandidates(),
      savedCandidates: new Map(),
      previousWinners: [4],
      previousLosers: [],
      positionsToFill: 1
    };

    const result = calculateResults(conditions);

    expect(result?.length).toEqual(1);
    expect(result[0]?.hash).toEqual(expect.any(String));
  });
});

export {};
