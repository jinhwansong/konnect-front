import { formatDuration as newFormatDuration } from './helpers';

export const formatMinutesToKorean = (minutes: number): string => {
  return newFormatDuration(minutes);
};
