import { formatDate as newFormatDate } from './helpers';

export const formatToKoreanDate = (dateString: string): string => {
  return newFormatDate(dateString);
};
