export const stateus = (status:string) => {
    if (status === 'inactivity') {
      return '비활성';
    }
    return '활성'
};