'use client'
import React from 'react'
import { scheduleDays } from '@/app/(client)/config/schedule';
import Button from '@/app/_component/Button';
import RejectModal from '@/app/(client)/_component/RejectModal';
import { usePopupStore } from '@/store/usePopupStore';
import style from './timeTable.module.scss';
import { slotTime } from '@/util/slotTime';
import { ISchedule, ITimeSlot } from '@/type';

interface ITimeTable {
  schedule: ISchedule;
  children: string;
  duration: number;
}

export default function TimeTable({ children, schedule, duration }: ITimeTable) {
  // 팝업 오픈
  const { popup3, onPopup3, closePop } = usePopupStore();
  const scheduleSlot = (time: ISchedule, durations: number): ISchedule => {
    if (!time || typeof time !== 'object') {
      return {}
    }
    const processSlot: ISchedule = {};
    Object.entries(time).forEach(([day, slots])=>{
      const days: ITimeSlot[] = [];
      // 해당 요일별로 처리
      slots.forEach((slot)=> {
        const timeSlot = slotTime(slot.startTime, slot.endTime, durations);
        days.push(...timeSlot);
      })
      processSlot[day] = days;
    })
    return processSlot;
  };
  const timeSlot = scheduleSlot(schedule, duration);
  return (
    <>
      <Button type="button" onClick={onPopup3} width="Big">
        {children}
      </Button>
      {popup3 && (
        <RejectModal closePop={closePop} title="정규 멘토링 일정">
          <ul className={style.table}>
            {scheduleDays.map((item) =>
              timeSlot[item.id]?.length ? (
                <li key={item.id}>
                  <em>{item.label}</em>
                  <div className={style.time}>
                    {timeSlot[item.id]?.map((time, i) => <span key={i}>{time.startTime} - {time.endTime}</span>
                    )}
                  </div>
                </li>
              ) : (
                <li key={item.id}>
                  <em>{item.label}</em>
                  <p className={style.no_time}>
                    해당 요일에는 정규일정이 없습니다.
                  </p>
                </li>
              )
            )}
          </ul>
        </RejectModal>
      )}
    </>
  );
}
