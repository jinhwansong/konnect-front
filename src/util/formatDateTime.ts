export const formatDateTime = (time: string) => {
  return time.split('T')[1].substring(0, 5);
};
