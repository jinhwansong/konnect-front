'use client';
import React, { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/esm/shared/types.js';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useUserData } from '@/app/_lib/useUser';
import { getAvailableDays, getAvailableTime } from '@/app/_lib/useEtc';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import useVaild from '@/hooks/useVaild';
import { formatNumber } from '@/util/formatNumber';
import { slotTime } from '@/util/slotTime';
import { formatDate } from '@/util/formatDate';
import { onEmail, onMessage, onPhone } from '@/util/useSign';
import { ITimeSlot } from '@/type';
import style from './apply.module.scss';
import { useToastStore } from '@/store/useToastStore';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface ITileDisabled {
  date: Date;
  view: 'month' | 'year' | 'century' | 'decade' | 'date';
}
interface IreservedTimes {
  startTime: string;
  endTime: string;
}
interface ITimeSlotWithCount extends ITimeSlot {
  currentCount: number;
  maxCount: number;
}

export default function Apply() {
  // 내정보
  const { data } = useUserData();
  const param = useParams();
  // 토스트 팝업
  const { showToast } = useToastStore((state) => state);
  // 연락받을 이메일
  const [email, changeEmail, emailError] = useVaild(
    data?.email || data?.snsId,
    onEmail
  );
  // 연락받을 폰번호
  const [phone, changePhone, phoneError] = useVaild(data?.phone, onPhone);
  // 메시지
  const [message, changeMessage, messageError] = useVaild('', onMessage);
  // 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot | null>(null);
  const handleDateChange = (date: Value) => {
    if (date instanceof Date) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };
  // 클릭할때
  const [showCalendar, setShowCalendar] = useState(false);
  const onShowCalendar = () => {
    setShowCalendar((prev) => !prev);
  };
  const onSlotbox = useCallback((slot: ITimeSlot) => {
    setSelectedSlot(slot);
    setShowCalendar(false);
  }, []);
  const getSlot = () => {
    if (!selectedDate || !selectedSlot) return '날짜 및 시간 선택';
    if (selectedSlot)
      return `${formatDate(selectedDate)} ${selectedSlot?.startTime}~${
        selectedSlot?.endTime
      } 0/1`;
  };
  // 시간 가져오기
  const year = selectedDate?.getFullYear() as number;
  const month = (selectedDate?.getMonth() as number) + 1;
  const day = selectedDate?.getDate() as number;
  const { data: availableTimes } = useQuery({
    queryKey: ['availableTimes', param.id, year, month, day],
    queryFn: () =>
      getAvailableTime({ id: parseInt(param.id as string), year, month, day }),
    enabled: !!selectedDate,
  });
  // 날짜 가져오기
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const { data: availableDates } = useQuery({
    queryKey: ['availableDate', param.id, currentYear, currentMonth],
    queryFn: () =>
      getAvailableDays({
        id: parseInt(param.id as string),
        year: currentYear,
        month: currentMonth,
      }),
  });
  // 저번달꺼 및 지난날들 클릭안됨
  const tileDisabled = ({ date }: ITileDisabled): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return today > date || !availableDates?.includes(dateStr);
  };
  const splitTimeSlot = (
    time: ITimeSlot[],
    duration: number,
    reservedTimes: IreservedTimes[],
  ): ITimeSlotWithCount[] => {
    const allSlot: ITimeSlotWithCount[] = [];
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    for (const slots of time) {
      const timeSlots = slotTime(slots.startTime, slots.endTime, duration);
      const slotCount = timeSlots.map((timeSlot) => {
        const slotStart = new Date(
          `${dateString}T${timeSlot.startTime}:00Z`
        ).toISOString();
        const slotEnd = new Date(
          `${dateString}T${timeSlot.endTime}:00Z`
        ).toISOString();
        const reserved = reservedTimes.filter((reservedTime) => {
          const reservedStart = new Date(reservedTime.startTime).toISOString();
          const reservedEnd = new Date(reservedTime.endTime).toISOString();
          return slotStart < reservedEnd && reservedStart < slotEnd;
        }).length;
        return {
          ...timeSlot,
          maxCount: 1,
          currentCount: reserved,
        };
      });

      allSlot.push(...slotCount);
    }
    return allSlot;
  };
  const timeSlot = availableTimes
    ? splitTimeSlot(
        availableTimes.availableSlots,
        availableTimes.duration,
        availableTimes.reservedTimes,
      )
    : [];
  const values = [
    {
      id: 'phone',
      label: '멘토와 연락 가능한 연락처',
      type: 'number',
      placeholder: '00000000000',
      value: phone || '',
      change: changePhone,
      error: phoneError,
    },
    {
      id: 'email',
      label: '멘토와 연락 가능한 이메일',
      type: 'text',
      placeholder: 'mentoring@konnect.com',
      value: email || '',
      change: changeEmail,
      error: emailError,
    },
    {
      id: 'textarea',
      label: '멘토님에게 남길 메시지',
      type: 'text',
      placeholder:
        '멘토링 받고 싶은 내용을 상세하게남겨주시면 더욱 의미있는 시간을 가질 수 있어요!',
      value: message || '',
      change: changeMessage,
      error: messageError,
    },
  ];
  const [tap, setTap] = useState(1);
  const disable = [message].every((k) => k.length > 0);
  // 결제
  const handlePayment = useCallback(async () => {
    const padMonth = String(month).padStart(2, '0');
    const padDay = String(day).padStart(2, '0');
    const startTime = `${year}-${padMonth}-${padDay}T${selectedSlot?.startTime}:00.000Z`;
    const endTime = `${year}-${padMonth}-${padDay}T${selectedSlot?.endTime}:00.000Z`;
    try {
       // 결제 초기화
       const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation`,
         {
           method: 'POST',
           credentials: 'include',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             email,
             phone,
             message,
             startTime,
             endTime,
             programsId: param.id,
           }),
         }
       );
       const res = await response.json();
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string
      );
      const payment = tossPayments.payment({ customerKey: `USER_${data.id}` });
      await payment?.requestPayment({
        method: 'CARD',
        orderName: res.orderName,
        customerName: data.name,
        customerEmail: data.email,
        amount: {
          value: res.amount,
          currency: 'KRW',
        },
        orderId: res.orderId,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error: any) {
      if (
        error.code === 'PAY_PROCESS_CANCELED' ||
        error.code === 'USER_CANCEL'
      ) {
        showToast('사용자가 결제를 취소했습니다', 'error');
        return;
      }
      if (error.code === 'INVALID_CARD_COMPANY') {
        showToast('지원하지 않는 카드사입니다', 'error');
        return;
      }
      showToast('결제 처리 중 오류가 발생했습니다.', 'error');
    }
  }, [
    showToast,
    phone,
    email,
    message,
    selectedSlot,
    param.id,
    day,
    year,
    month,
    data,
  ]); 
  return (
    <div className={style.apply_wrap}>
      {tap === 1 && (
        <>
          <h4 className={style.title}>
            신청하기<span>(1/2)</span>
          </h4>
          <div className={style.apply_form}>
            <div>
              <label className={style.label}>
                스케줄 설정<span>*</span>
              </label>
              <button
                onClick={() => onShowCalendar()}
                type="button"
                className={style.seleted_days}
              >
                {getSlot()}
              </button>
              {showCalendar && (
                <>
                  <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    locale="ko-KR"
                    calendarType="hebrew"
                    className={style.calendar}
                    tileDisabled={tileDisabled}
                    minDetail="month"
                    maxDetail="month"
                    prev2Label={null}
                    next2Label={null}
                    prevLabel={<IoIosArrowBack />}
                    nextLabel={<IoIosArrowForward />}
                    showNavigation={true}
                    formatMonthYear={(locale, date) =>
                      `${date.getFullYear()}.${String(
                        date.getMonth() + 1
                      ).padStart(2, '0')}`
                    }
                    formatDay={(locale, date) => {
                      return `${date.getDate()}`;
                    }}
                  />
                  {selectedDate && (
                    <div className={style.slot_Box}>
                      <span>*한국 시간 기준입니다.</span>
                      <div className={style.slot_button}>
                        {timeSlot.map((slot) => (
                          <button
                            key={slot.startTime}
                            type="button"
                            onClick={() => onSlotbox(slot)}
                            className={
                              slot.currentCount === slot.maxCount
                                ? style.reserved
                                : ''
                            }
                            disabled={slot.currentCount === slot.maxCount}
                          >
                            {slot.startTime}~{slot.endTime}
                            <span>
                              {slot.currentCount}/{slot.maxCount}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {values.map((value) => (
              <div key={value.id}>
                <label htmlFor={value.id} className={style.label}>
                  {value.label}
                  <span>*</span>
                </label>
                {value.id !== 'textarea' ? (
                  <Input
                    type={value.type}
                    value={value.value}
                    name={value.id}
                    onChange={value.change}
                    placeholder={value.placeholder}
                  />
                ) : (
                  <textarea
                    className={style.textarea}
                    value={value.value}
                    name={value.id}
                    onChange={value.change}
                    placeholder={value.placeholder}
                  />
                )}

                <p className={style.error}>{value.error}</p>
              </div>
            ))}
          </div>
          <div className={style.button_wrap}>
            <Button
              type="button"
              onClick={() => setTap(2)}
              width="Big"
              disabled={
                phoneError !== '' ||
                emailError !== '' ||
                messageError !== '' ||
                !disable ||
                selectedSlot === null
              }
            >
              다음으로
            </Button>
          </div>
        </>
      )}
      {tap === 2 && (
        <>
          <h4 className={style.title}>
            신청 정보 확인<span>(2/2)</span>
          </h4>
          <ul className={style.info}>
            <li>
              <em>멘토링명</em>
              <p>{availableTimes?.title}</p>
            </li>
            <li>
              <em>멘토</em>
              <p>{availableTimes?.name}</p>
            </li>
            <li>
              <em>멘티</em>
              <p>{data?.name}</p>
            </li>
            <li>
              <em>일정</em>
              <p>{getSlot()}</p>
            </li>
            <li>
              <em>연락처</em>
              <p>{phone}</p>
            </li>
            <li>
              <em>이메일</em>
              <p>{email}</p>
            </li>
            <li>
              <em>메시지</em>
              <p>{message}</p>
            </li>
          </ul>
          <div className={style.price}>
            <p>결제 금액</p>
            <em>{formatNumber(availableTimes?.price)}원</em>
          </div>
          <div className={style.button_wrap}>
            <Button
              type="button"
              onClick={() => setTap(1)}
              width="Big"
              bg="none"
            >
              이전으로
            </Button>
            <Button type="button" onClick={handlePayment} width="Big">
              결제하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
