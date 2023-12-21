'use client';

import { Ballot } from '@prisma/client';
import { AlertButton } from 'components/AlertButton';

interface Props {
  ballot: Ballot;
  deleteBallot: (ballotId: string) => void;
}

export const DeleteBallot: React.FC<Props> = ({ ballot, deleteBallot }) => {
  return (
    <AlertButton onClick={() => deleteBallot(ballot.id)}>
      Delete ballot
    </AlertButton>
  );
};
