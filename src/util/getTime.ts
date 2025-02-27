export default function getTime(time:string) {
  const targetTime = new Date(time).getTime();
  const currentTime = new Date().getTime();
  const differentTime =  Math.floor(Number(currentTime - targetTime) / 1000);
  if (differentTime < 60) {
    return `${differentTime}초 전`;
  } else if (differentTime < 60 * 60) {
    const min = Math.floor(differentTime / 60);
    return `${min}분 전`;
  } else if (differentTime < 60 * 60 * 24) {
    const hours = Math.floor(differentTime / (60 * 60));
    return `${hours}시간 전`;
  } else if (differentTime < 60 * 60 * 24 * 30) {
    const hours = Math.floor(differentTime / (60 * 60 * 24));
    return `${hours}일 전`;
  } else if (differentTime < 60 * 60 * 24 * 30 * 12) {
    const hours = Math.floor(differentTime / (60 * 60 * 24 * 30));
    return `${hours}달 전`;
  } else {
    const years = Math.floor(differentTime / (60 * 60 * 24 * 30 * 12));
    return `${years}년 전`;
  }
}
