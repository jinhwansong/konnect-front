'use client';
import React, { FormEvent, useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Input from '@/app/_component/Input';
import Editor from '@/app/_component/Editor';
import { Days, scheduleDays } from '@/app/(client)/config/schedule';
import { slotTime } from '@/util/slotTime';
import useSelect from '@/hooks/useSelect';
import useInput from '@/hooks/useInput';
import useNumber from '@/hooks/useNumber';
import { useToastStore } from '@/store/useToastStore';
import { usePopupStore } from '@/store/usePopupStore';
import Button from '@/app/_component/Button';
import { joblist } from '@/app/(client)/config/job';
import {
  IErr,
  IModifyProgram,
  ITimeSlot,
} from '@/type';
import style from './programForm.module.scss';
import Selet from '@/app/_component/Selet';
import { useCreateProgram, useModifyProgram } from '@/app/_lib/useMentor';



interface IProgramForm {
  mode: string;
  initialData?: IModifyProgram;
}

type DayType =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// 서버 스케줄 형식
type IServerSchedule = {
  [key in DayType]?: ITimeSlot[];
};
// 프론트에서 사용할 시간선택
interface ITimeSelection {
  [time: string]: boolean;
}
// 프론트 스케줄 형식
type ISchedule = {
  [key in DayType]?: ITimeSelection;
}
export default function ProgramForm({ mode, initialData }: IProgramForm) {
  const params = useParams()
  // 캐싱
  const queryClient = useQueryClient();
  // toast팝업
  const { showToast } = useToastStore((state) => state);
  const router = useRouter();
  // 제목
  const [title, onTitle] = useInput(initialData ? initialData?.title : '');
  // 가격
  const [prices, changePrice, price] = useNumber(
    initialData ? String(initialData?.price) : ''
  );
  // 1회당 시간
  const [durations, changeDuration, duration] = useNumber(
    initialData ? String(initialData?.duration) : ''
  );
  // 내용
  const [content, setContent] = useState(
    initialData ? String(initialData?.content) : ''
  );
  const onContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);
  
  // 초기 시간표 생성 - 30분 단위 시간 생성 9 - 22
  const createTime = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const min = i % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${min}`;
  });
  // 타임 테이블 버튼
  const onTimeTable = useCallback((day: DayType, time: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [time]: !prev[day]?.[time] },
    }));
  }, []);


  // 서버 데이터에서 프론트 데이터로 형식 변환
  const converSlot = (back: IServerSchedule): ISchedule => {
     if (!back) return {} as ISchedule;
      const conver = {} as ISchedule;
    const days = (day: string): day is DayType => Days.includes(day as DayType);
    Object.entries(back).forEach(([day, times]) => {
      if (days(day)) {
        const timeSlots: ITimeSelection = {};
        times?.forEach((timeSlot: ITimeSlot) => {
          const slots = slotTime(timeSlot.startTime, timeSlot.endTime, 30).map((slot)=> slot.startTime);
          slots.forEach((time: string) => {
            timeSlots[time] = true;
          });
        });
        conver[day as DayType] = timeSlots;
      }
    });
    return conver;
  };
  // 서버가 원하는 데이터로 변환
  const converSchedule = useCallback(
    (schedule: ISchedule) => {
      const res: any = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };
      // entries 키 : 값으로 쌍의 배열로 변환
      Object?.entries(schedule).forEach(([day, time]) => {
        if (!time || !day) return;
        const seletTime = Object.entries(time)
          .filter(([_, selet]) => selet)
          .map(([time]) => time)
          .sort();
        if (seletTime.length === 0) return;
        let startTime = seletTime[0];
        for (let i = 1; i < seletTime.length; i++) {
          const currentTime = seletTime[i];
          const nextTime = seletTime[i + 1];
          // 연속되는 시간대가 없을경우 30인 이유는 30분단위로 선택 가능해서
          if (!nextTime || getMinDiff(currentTime, nextTime) > 30) {
            res[day].push({
              startTime,
              endTime: addMinutes(currentTime, duration),
            });
            startTime = nextTime;
          }
        }
      });
      return res;
    },
    [duration]
  );
  // 스케줄 설정
  const [schedule, setSchedule] = useState<ISchedule>(
    initialData ? converSlot(initialData?.available_schedule) : {}
  );
  // endtime 계산
  const addMinutes = (time: string, minutes: number) => {
    // 시 분 으로 분리
    const [hour, min] = time.split(':').map(Number);
    // 전체 시간을 분으로 변환 추가분 추가
    const totalMinutes = hour * 60 + min + minutes;
    // 다시 시간 변환
    const newHour = Math.floor(totalMinutes / 60);
    // 나머지값 분으로
    const newMins = totalMinutes % 60;
    return `${String(newHour).padStart(2, '0')}:${String(newMins).padStart(
      2,
      '0'
    )}`;
  };
  // 시간 차가 있을시
  const getMinDiff = (time1: string, time2: string) => {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h2 * 60 + m2 - (h1 * 60 + m1);
  };
  const createProgram = useCreateProgram();
  const modifyProgram = useModifyProgram();
  const { onPopup3, popup3 } = usePopupStore();
  const [mentoring, onMentoring] = useSelect(
    initialData ? initialData.mentoring_field : '',
    onPopup3
  );
  const onProgram = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (title.length === 0) return showToast('제목을 적어주세요', 'error');
      if (price === 0) return showToast('가격을 적어주세요', 'error');
      if (duration === 0)
        return showToast('1회당 시간을 적어주세요', 'error');
      if (content.length === 0) return showToast('내용을 적어주세요', 'error');
      if (Object.keys(schedule).length === 0) return showToast('스케줄을 선택해주세요', 'error');
      if (mentoring.length === 0)
        return showToast('카테고리를 선택해주세요', 'error');
      const available_schedule = converSchedule(schedule);
      const data = queryClient.getQueryData(['mentorDetail', params.id]);
      queryClient.setQueryData(['mentorDetail', params.id], (old: any) => {
        return {
          ...old,
          title,
          content,
          price,
          duration,
          available_schedule,
          mentoring_field: mentoring,
        };
      });
      const mutationOptions = {
        onSuccess: (data: any) => {
          queryClient.invalidateQueries({
            queryKey: ['mentors'],
            exact: false,
          });
          router.back();
          showToast(data.message, 'success');
        },
        onError: (error: Error) => {
          queryClient.setQueryData(['mentorDetail', params.id], data);
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      };
      if (mode === 'edit') {
        createProgram.mutate(
          {
            title,
            price,
            duration,
            content,
            available_schedule,
            mentoring_field: mentoring,
          },
          mutationOptions
        );
      }
      if (mode === 'modify') {
        modifyProgram.mutate(
          {
            title,
            price,
            duration,
            content,
            id: initialData?.id as number,
            available_schedule,
            mentoring_field: mentoring,
          },
          mutationOptions
        );
      }
    },
    [
      params,
      mentoring,
      converSchedule,
      schedule,
      initialData?.id,
      modifyProgram,
      mode,
      title,
      price,
      router,
      duration,
      content,
      createProgram,
      showToast,
      queryClient,
    ]
  );
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <section className={style.add_section}>
      <h4 className={style.add_title}>
        멘토링 프로그램 {mode === 'edit' ? '등록' : '수정'}
      </h4>
      <form onSubmit={onProgram}>
        <article className={style.add_article}>
          <label htmlFor="title">
            멘토링 명 <em>(한 줄 요약)</em> <span>*</span>
          </label>
          <Input
            name="title"
            type="text"
            placeholder="예) 개발자 취업 / 면접 / 이직 / 커리어 멘토링"
            value={title}
            onChange={onTitle}
          />
        </article>
        <article className={style.add_article}>
          <label htmlFor="price">
            멘토링 1회당 가격 <span>*</span>
          </label>
          <Input
            name="price"
            type="text"
            placeholder="10000"
            value={prices}
            onChange={changePrice}
          />
        </article>
        <article className={style.add_article}>
          <label htmlFor="duration">
            멘토링 1회당 시간 <em>(30분 단위)</em> <span>*</span>
          </label>
          <Input
            name="duration"
            type="text"
            placeholder="60"
            value={durations}
            onChange={changeDuration}
          />
        </article>
        <article className={style.add_article}>
          <label htmlFor="duration">
            멘토링 카테고리 <span>*</span>
          </label>
          <Selet
            list={joblist}
            open={popup3}
            onPopup={onPopup3}
            seletText={mentoring}
            text="희망하시는 멘토링 분야를 선택해주세요"
            onSelet={onMentoring}
          />
        </article>
        <article className={style.add_article}>
          <label>
            스케줄 설정 <em>(멘토링 가능한 일정을 선택해 주세요)</em>{' '}
            <span>*</span>
          </label>
          <div className={style.time_table}>
            <table>
              <thead>
                <tr>
                  <th />
                  {scheduleDays.map((day) => (
                    <th key={day.id}>{day.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {createTime.map((time) => (
                  <tr key={time}>
                    <td>{time}</td>
                    {scheduleDays.map((day) => (
                      <td key={`${day.id} - ${time}`}>
                        <button
                          type="button"
                          onClick={() => onTimeTable(day.id as DayType, time)}
                          className={
                            schedule[day.id as DayType]?.[time]
                              ? style.active
                              : ''
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className={style.add_article}>
          <label htmlFor="content">
            멘토링 소개 <em>(멘토링 분야, 범위 자기도개 등등...)</em>{' '}
            <span>*</span>
          </label>
          <Editor onIntroduce={onContent} introduce={content} />
        </article>
        <div className={style.button_wrap}>
          <Button type="button" onClick={handleCancel} bg="none" width="Small">
            취소
          </Button>
          <Button type="submit" width="Small">
            {mode === 'modify' ? '수정' : '등록'}
          </Button>
        </div>
      </form>
    </section>
  );
}
