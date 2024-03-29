import { CandidateSmallId, GraphNode, ResultNodeOptions } from 'types/graph';
import { generateNodeHash } from './generateNodeHash';

const getEmptyGraphNode = (): GraphNode => {
  return {
    hash: '',
    results: new Map(),
    winners: [],
    losers: [],
    children: [],
    percentageOutcome: 0
  };
};
export const generateResultNode = (options: ResultNodeOptions): GraphNode => {
  const { ballots, candidates, winners = [], losers = [] } = options;

  if (
    winners.length === 0 &&
    losers.length === 0 &&
    (ballots.length === 0 || candidates.size === 0)
  ) {
    return getEmptyGraphNode();
  }

  const candidateVotes: Map<CandidateSmallId, number> = new Map();

  ballots.forEach((ballot) => {
    if (!ballot.ranking.length) return;

    candidateVotes.set(
      ballot.ranking[0],
      (candidateVotes.get(ballot.ranking[0]) ?? 0) + 1
    );
  });

  candidates.forEach((candidate) => {
    if (!ballots.length) return;
    if (!candidateVotes.has(candidate.smallId)) {
      candidateVotes.set(candidate.smallId, 0);
    }
  });

  const sortedResults = new Map(
    [...candidateVotes].sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
  );

  return {
    hash: generateNodeHash(sortedResults, winners, losers),
    results: sortedResults,
    winners,
    losers,
    children: [],
    percentageOutcome: 0
  };
};
