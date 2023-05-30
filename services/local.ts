import { Candidate, Position } from '@prisma/client';
import {
  UncreatedCandidate,
  UncreatedPosition
} from 'types/types';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const createPosition = async (position: UncreatedPosition) => {
  const url = '/api/positions';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(position)
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result as Position;
};

export const updatePosition = async (
  positionId: string,
  position: Position
) => {
  const url = `/api/positions/${positionId}`;
  const options: RequestInit = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(position)
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result as Position;
};

export const createCandidate = async (
  positionId: string,
  candidate: UncreatedCandidate
) => {
  const url = `/api/positions/${positionId}/candidates`;
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(candidate)
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result as Candidate;
};
