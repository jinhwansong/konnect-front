import { ITimeSlot } from "@/type";



// 시작 시간과 종료 시간 사이 분으로 나누기
export const slotTime = (t1: string, t2: string, dur: number): ITimeSlot[] => {
  if(!t1 || !t2 || !dur) return [];
  const slot: ITimeSlot[] = [];
  // 시간 비교를 위해 임의 날짜 투입
  const start = new Date(`2025.01.01 ${t1}`);
  const end = new Date(`2025.01.01 ${t2}`);
  while (start < end) {
    // slot 배열에 시간을 00:00형식으로 변환
    const slotStart = start.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    // 시작 시간에 1회당 시간만큼 더함
    start.setTime(start.getTime() + dur * 60000);
    // 종료시간은 다음 시작 시간 또는 전체 종료 시간
    const slotEnd = start <= end ? start.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) : t2;
   slot.push({
    startTime: slotStart,
    endTime: slotEnd,
   })
  }
  return slot;
};
