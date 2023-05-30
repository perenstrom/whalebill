export const getShortId = (uuid: string) => {
  const parts = uuid.split('-');

  return parts[parts.length - 1];
};
