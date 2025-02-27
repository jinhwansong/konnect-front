export const formatDate = (isoDate: string | Date): string => {
  if (!isoDate) return '';
  if(isoDate instanceof Date) {
    return `${isoDate.getFullYear()}.${String(isoDate.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(isoDate.getDate()).padStart(2, '0')}`;
  }
  return isoDate?.substring(0, 10).replace(/-/g, '.');
};
