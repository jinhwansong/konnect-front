'use client';
import React, { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDetailSchedule, useCreateRoom, useMentoringApproval } from '@/app/_lib/useMentor';
import style from './schedule.module.scss';
import Image from 'next/image';
import { getImageUrl } from '@/util/getImageUrl';
import { formatDate } from '@/util/formatDate';
import { formatDateTime } from '@/util/formatDateTime';
import { getStatus } from '@/app/(client)/config/columns';
import { IErr, StatusType } from '@/type';
import { useToastStore } from '@/store/useToastStore';
import useInput from '@/hooks/useInput';
import Button from '@/app/_component/Button';
import { usePopupStore } from '@/store/usePopupStore';
import RejectModal from '@/app/(client)/_component/RejectModal';

interface ISchedulePage {
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  phone: string;
  message: string;
  email: string;
  name: string;
  image: string;
}


export default function SchedulePage() {
  const param = useParams();
  const router = useRouter();
  const { data } = useQuery<ISchedulePage>({
    queryKey: ['scheduleDetail', param.id],
    queryFn: () => getDetailSchedule(param.id as string),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  // 캐시 무효화
  const queryclient = useQueryClient();
  // toast팝업
  const { showToast } = useToastStore((state) => state);
  // 팝업 오픈
    const { popup2, onPopup2, closePop } = usePopupStore();
  // 거절사유
  const [reason, changeReason, setReason] = useInput('');
  const approvalMutation = useMentoringApproval();
  // 거절
  const onCancel = useCallback(() => {
    approvalMutation.mutate(
      { approved: false, id: Number(param.id), reason },
      {
        onSuccess: (data) => {
          showToast(data.message, 'success');
          setReason('');
          closePop();
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
          closePop();
        },
      }
    );
  }, [approvalMutation, param.id, showToast, reason, closePop, setReason]);
  // 승인
  const onApproval = useCallback(() => {
    approvalMutation.mutate(
      { approved: true, id: Number(param.id) },
      {
        onSuccess: (data: any) => {
          showToast(data.message, 'success');
          queryclient.invalidateQueries({
            queryKey: ['schedule'],
          });
          queryclient.setQueryData(
            ['scheduleDetail', param.id],
            (oldData: any) => ({
              ...oldData,
              status: 'progress',
            })
          );
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      }
    );
  }, [approvalMutation, param.id, showToast, queryclient]);
  // 채팅방 입장
  const createRoomMutation = useCreateRoom();
  const onChat = useCallback(() => {
    createRoomMutation.mutate(
      { chatRoomId: Number(param.id) },
      {
        onSuccess: (data: any) => {
          showToast(data.message, 'success');
          router.push(`/chat/${data.chatRoomId}`);
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      }
    );
  }, [createRoomMutation, param.id, showToast, router]);
  return (
    <section className={style.schedule_section}>
      <div className={style.schedule}>
        <em>예약 정보</em>
        <strong className={style.title}>{data?.title}</strong>
        <ul className={style.textbox2}>
          <li>
            <em>예약시간</em>
            <p>
              {formatDate(data?.startTime as string)}{' '}
              {data?.startTime && formatDateTime(data?.startTime as string)} -{' '}
              {data?.endTime && formatDateTime(data?.endTime as string)}
            </p>
          </li>
          <li>
            <em>예약상태</em>
            <p>{getStatus[data?.status as StatusType]}</p>
          </li>
        </ul>
      </div>
      <div className={style.schedule}>
        <em>신청자 정보</em>
        <div className={style.content}>
          <div className={style.imgbox}>
            <Image
              src={getImageUrl(data?.image as string)}
              alt={data?.name as string}
              height={196}
              width={210}
            />
          </div>
          <ul className={style.textbox}>
            <li>
              <em>이름 | Name</em>
              <p>{data?.name}</p>
            </li>
            <li>
              <em>연락처 | phone</em>
              <p>{data?.phone}</p>
            </li>
            <li>
              <em>이메일 | email</em>
              <p>{data?.email}</p>
            </li>
          </ul>
        </div>
        <p className={style.message}>{data?.message}</p>
      </div>
      {data?.status === 'confirmed' && (
        <div className={style.button}>
          <Button
            type="button"
            width="80"
            height="40"
            bg="none"
            onClick={() => onPopup2()}
            disabled={data?.status !== 'confirmed'}
          >
            거절
          </Button>
          <Button
            type="button"
            width="80"
            height="40"
            onClick={() => onApproval()}
            disabled={data?.status !== 'confirmed'}
          >
            승인
          </Button>
        </div>
      )}
      {data?.status === 'progress' && (
        <div className={style.button}>
          <Button
            type="button"
            width="80"
            height="40"
            onClick={() => onChat()}
            disabled={data?.status !== 'progress'}
          >
            채널 생성
          </Button>
        </div>
      )}

      {popup2 && (
        <RejectModal closePop={closePop} title="멘토링 신청 거절">
          <div className={style.modal}>
            <textarea
              placeholder="상세한 거절 사유를 입력해주세요"
              value={reason}
              onChange={changeReason}
              name="reason"
              className={style.textarea}
            />
            <div className={style.button}>
              <Button
                type="button"
                width="80"
                height="40"
                bg="none"
                onClick={() => closePop()}
              >
                취소
              </Button>
              <Button
                type="button"
                width="80"
                height="40"
                onClick={() => onCancel()}
              >
                확인
              </Button>
            </div>
          </div>
        </RejectModal>
      )}
    </section>
  );
}

status: 'confirmed';
