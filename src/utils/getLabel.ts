import { findOptionLabel as newFindOptionLabel } from './helpers';

export const findOptionLabel = (
  value: string,
  options: { label: string; value: string }[]
): string => {
  return newFindOptionLabel(value, options);
};
