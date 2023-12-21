import { CandidateId } from 'types/graph';
import { AdminPosition } from 'types/types';

export const getCandidate = (
  position: AdminPosition,
  candidateId: CandidateId
) => position.candidates.find((candidate) => candidate.id === candidateId);
