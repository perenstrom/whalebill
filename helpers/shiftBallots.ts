import { Ballot } from 'types/graph';

export const shiftBallots = (ballots: Ballot[], candidateId: string): Ballot[] =>
  ballots.map((ballot) => {
    const ranking = ballot.ranking.filter((id) => id !== candidateId);
    return { ...ballot, ranking };
  });
