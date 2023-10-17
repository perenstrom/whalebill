import { Ballot, CandidateSmallId } from 'types/graph';

export const shiftBallots = (
  ballots: Ballot[],
  candidateSmallId: CandidateSmallId
): Ballot[] =>
  ballots.map((ballot) => {
    const ranking = ballot.ranking.filter((id) => id !== candidateSmallId);
    return { ...ballot, ranking };
  });
