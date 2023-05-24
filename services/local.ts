import { UncreatedPosition } from 'types/types';

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

  return result;
};
