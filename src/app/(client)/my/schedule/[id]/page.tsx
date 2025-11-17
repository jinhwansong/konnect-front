'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import FormErrorMessage from '@/components/common/FormErrorMessage';
import Modal from '@/components/common/Modal';
import Textarea from '@/components/common/Textarea';
import { colorMap, MentoringStatus, statusMap } from '@/contact/schedule';
import {
  useGetScheduleReservationsDetail,
  useScheduleStatus,
} from '@/hooks/query/useSchedule';
import { ReasonForm, reasonSchema } from '@/schema/schedule';
import { useToastStore } from '@/stores/useToast';
import { Reason } from '@/types/schedule';

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { show } = useToastStore();
  const { data: schedule, isLoading } = useGetScheduleReservationsDetail(
    id as string
  );
  const [popup, setPopup] = useState(false);
  const closePopup = () => setPopup(prev => !prev);
  const { mutate: scheduleStatus } = useScheduleStatus();
  const infoList = [
    {
      label: '상태',
      value: (
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${colorMap[schedule?.status as MentoringStatus]}`}
        >
          {statusMap[schedule?.status as MentoringStatus]}
        </span>
      ),
    },
    {
      label: '예약일',
      value: schedule?.date,
    },
    {
      label: '시간',
      value: `${schedule?.startTime} ~ ${schedule?.endTime}`,
    },
  ];
  const methods = useForm<ReasonForm>({
    mode: 'all',
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      rejectReason: '',
    },
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid, errors },
  } = methods;
  const onSubmit = (data: Reason) => {
    scheduleStatus(
      { id: schedule?.id as string, rejectReason: data.rejectReason },
      {
        onSuccess: () => {
          closePopup();
          reset();
          show('예약거절을 완료했습니다.', 'success');
        },
        onError: error => {
          const errorMessage =
            error instanceof Error ? error.message : '오류가 발생했습니다.';
          show(errorMessage, 'error');
        },
      }
    );
  };

  const handleJoinMeeting = () => {
    router.push(`/rooms/${schedule?.roomId}`);
  };
  if (isLoading) return null;
  return (
    <section className="flex-1 text-sm text-[var(--text)]">
      <h1 className="mb-6 text-2xl leading-snug font-bold text-[var(--text-bold)]">
        {schedule?.title}
      </h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {infoList.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] p-4"
          >
            <p className="mb-1 text-xs text-[var(--text-sub)]">{item.label}</p>
            <p className="text-lg font-semibold text-[var(--text-bold)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)] bg-white">
        <div className="flex justify-between px-4 py-3">
          <span className="text-[var(--text-sub)]">멘티</span>
          <span className="font-medium">{schedule?.menteeName}</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="text-[var(--text-sub)]">이메일</span>
          <span>{schedule?.menteeEmail}</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="text-[var(--text-sub)]">전화번호</span>
          <span>{schedule?.menteePhone}</span>
        </div>
      </div>

      {schedule?.question && (
        <div className="mb-6 rounded-xl border border-[var(--border-color)] p-4">
          <p className="mb-1 text-[var(--text-sub)]">멘티 질문</p>
          <p className="text-[var(--text)]">{schedule?.question}</p>
        </div>
      )}

      {schedule?.rejectReason && (
        <div className="mb-6 rounded-xl border border-red-200 p-4">
          <p className="mb-1 text-red-500">거절 사유</p>
          <p className="text-red-700">{schedule?.rejectReason}</p>
        </div>
      )}
      {schedule?.status === 'confirmed' && (
        <Button type="button" variant="danger" onClick={closePopup}>
          예약 거절하기
        </Button>
      )}
      {schedule?.status === 'progress' && (
        <Button type="button" variant="primary" onClick={handleJoinMeeting}>
          미팅 참가하기
        </Button>
      )}
      {popup && (
        <Modal onClose={closePopup}>
          <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
            예약 거절
          </h4>
          <FormProvider {...methods}>
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col"
            >
              <div className="mb-4 rounded-lg border border-[var(--border-color)] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-sub)]">예약</span>
                  <span className="font-medium text-[var(--text-bold)]">
                    {schedule?.date} {schedule?.startTime}~{schedule?.endTime}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[var(--text-sub)]">멘티</span>
                  <span>{schedule?.menteeName}</span>
                </div>
              </div>
              <Controller
                name="rejectReason"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="거절 사유를 입력해주세요"
                    maxLength={1000}
                    className="h-[200px]"
                  />
                )}
              />
              <FormErrorMessage
                message={errors.rejectReason?.message}
                className="mt-1"
              />
              <div className="mt-4 rounded-lg border border-[var(--border-color)] p-3 text-sm leading-relaxed">
                <p className="text-[var(--text-sub)]">
                  예약을 거절하면 해당 결제는 즉시 환불 처리되며, 멘티에게
                  알림이 전송됩니다. 필요 시 채팅에서 대체 가능한 시간대를 함께
                  안내해 주세요.
                </p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" onClick={closePopup} variant="outline">
                  취소
                </Button>
                <Button type="submit" disabled={!isValid} variant="danger">
                  거절하기
                </Button>
              </div>
            </form>
          </FormProvider>
        </Modal>
      )}
    </section>
  );
}
