import { formatCurrency as newFormatCurrency } from './helpers';

export const formatToKoreanWon = (amount: number): string => {
  return newFormatCurrency(amount);
};
