'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { useGetSessionDetail } from '@/hooks/query/useCommonSession';
import {
  useGetReservationsDays,
  useGetReservationsTime,
} from '@/hooks/query/useReservation';
import { ReservationForm, reservationSchema } from '@/schema/reservation';
import { useReservation } from '@/stores/useReservation';
import { Slot } from '@/types/reservation';

import Button from '../common/Button';
import CheckboxGroup from '../common/CheckboxGroup';
import FormErrorMessage from '../common/FormErrorMessage';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';

enum Weekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export default function ReserveModal({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { set, reservation, reset } = useReservation();
  const methods = useForm<ReservationForm>({
    mode: 'all',
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: '',
      timeSlot: { startTime: '', endTime: '' },
      question: '',
    },
  });
  const {
    control,
    watch,
    reset: resetReservationForm,
    handleSubmit,

    formState: { isValid, errors },
  } = methods;
  /** 예약 정보 초기화 */
  useEffect(() => {
    if (!reservation) return;
    resetReservationForm({
      date: reservation.date,
      timeSlot: {
        startTime: reservation.timeSlot.startTime,
        endTime: reservation.timeSlot.endTime,
      },
      question: reservation.question ?? '',
    });
  }, [reservation, resetReservationForm]);

  /** 선택한 날짜 */
  const selectDate = watch('date');

  const { data: session, isLoading: sessionLoading } =
    useGetSessionDetail(sessionId);

  /** 멘토가 설정한 요일 */
  const { data: reservationsDays } = useGetReservationsDays(
    session?.userId ?? ''
  );

  /** 예약 가능한 시간 */
  const { data: reservationsTime, isLoading: timeLoading } =
    useGetReservationsTime(sessionId, selectDate as string);

  const slots = useMemo<Slot[]>(
    () => reservationsTime?.data ?? [],
    [reservationsTime?.data]
  );

  const slotOptions = useMemo(
    () =>
      slots.map(slot => {
        const value = {
          startTime: slot.startTime.slice(0, 5),
          endTime: slot.endTime.slice(0, 5),
        };
        return {
          label: `${value.startTime} ~ ${value.endTime}`,
          value: JSON.stringify(value),
        };
      }),
    [slots]
  );

  // 예약이 가능한 날짜
  const enabledDayIndexes = reservationsDays?.data.map(
    day => Weekday[day as keyof typeof Weekday]
  );

  const isDateEnabled = (date: Date) => {
    const today = new Date();
    const isFuture = date >= new Date(today.setHours(0, 0, 0, 0));
    const isCorrectDay = enabledDayIndexes?.includes(date.getDay());
    return isFuture && isCorrectDay;
  };
  const onSubmit = (data: ReservationForm) => {
    const slot = data.timeSlot;
    set({
      ...data,
      timeSlot: slot,
      sessionId: session?.id as string,
      duration: session?.duration as number,
      sessionTitle: session?.title as string,
      mentorName: session?.nickname as string,
      amount: session?.price as number,
    });
    router.push(`/mentors/${sessionId}/confirm`);
  };
  const handleClose = () => {
    router.replace(`/mentors/${session?.id}`);
    reset();
  };
  if (sessionLoading) return null;
  return (
    <Modal onClose={() => handleClose()}>
      <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
        멘토링 예약
      </h4>
      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="date"
            rules={{ required: '날짜를 선택해 주세요' }}
            control={methods.control}
            render={({ field }) => (
              <Calendar
                value={
                  field.value
                    ? parse(field.value, 'yyyy-MM-dd', new Date())
                    : null
                }
                onChange={d => {
                  field.onChange(format(d as Date, 'yyyy-MM-dd'));
                  methods.setValue('timeSlot', { startTime: '', endTime: '' });
                }}
                locale="ko-KR"
                calendarType="hebrew"
                tileDisabled={({ date }) => !isDateEnabled(date)}
                minDetail="month"
                maxDetail="month"
                prev2Label={null}
                next2Label={null}
                prevLabel={<IoIosArrowBack />}
                nextLabel={<IoIosArrowForward />}
                formatDay={(locale, date) => date.getDate().toString()}
                className="react-calendar"
              />
            )}
          />

          {selectDate && !timeLoading && slots.length > 0 && (
            <div className="mt-2 rounded-lg border border-[var(--border-color)] p-3">
              <Controller
                name="timeSlot"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    value={
                      field.value ? JSON.stringify(field.value) : undefined
                    }
                    onChange={val => {
                      field.onChange(JSON.parse(val as string));
                    }}
                    className="grid grid-cols-3 gap-2 text-center"
                    options={slotOptions}
                    type="radio"
                  />
                )}
              />
              <FormErrorMessage
                message={errors.timeSlot?.message}
                className="mt-1"
              />
            </div>
          )}
          <h4 className="mt-5 mb-2 text-sm">멘토님에게 남길 메시지</h4>
          <Controller
            name="question"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                placeholder="자기소개를 입력해주세요."
                maxLength={500}
                error={fieldState.error?.message}
              />
            )}
          />
          <FormErrorMessage
            message={errors.question?.message}
            className="mt-1"
          />

          <Button type="submit" disabled={!isValid} className="mt-3 w-full">
            다음으로
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
