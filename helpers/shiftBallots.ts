import { Ballot } from 'types/graph';

export const shiftBallots = (ballots: Ballot[], candidateId: string) =>
  ballots.map((ballot) => {
    const ranking = ballot.ranking.filter((id) => id !== candidateId);
    return { ...ballot, ranking };
  });
