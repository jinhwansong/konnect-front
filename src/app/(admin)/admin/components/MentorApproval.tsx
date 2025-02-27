'use client'
import React, { useCallback } from 'react'
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/app/_component/Button';
import RejectModal from '@/app/(client)/_component/RejectModal';
import { findMentorApproval, useMentor } from '../_lib/find.mentors';
import { useToastStore } from '@/store/useToastStore';
import { usePopupStore } from '@/store/usePopupStore';
import useInput from '@/hooks/useInput';
import { getImageUrl } from '@/util/getImageUrl';
import { formatDate } from '@/util/formatDate';
import { IErr } from '@/type';
import style from './mentorApproval.module.scss';

export default function MentorApproval() {
  // 캐시 무효화
  const queryclient = useQueryClient();
  // URL 경로
  const pathname = usePathname();
  const id = parseInt(pathname.split('/')[3]);
  // 팝업 오픈
  const { popup, onPopup, closePop } = usePopupStore();
  // toast팝업
  const { showToast } = useToastStore((state) => state);
  // 정보
  const { data } = useQuery({
    queryKey: ['approval', id],
    queryFn: () => findMentorApproval(id),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  // 거절사유
  const [reason, changeReason] = useInput('');
  const checkMentorMutation = useMentor();
  // 거절
  const onCancel = useCallback(() => {
    checkMentorMutation.mutate(
      { approved: false, id, reason },
      {
        onSuccess: (data) => {
          showToast(data.message, 'success');
          closePop();
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
          closePop();
        },
      }
    );
  }, [checkMentorMutation, id, showToast, reason, closePop]);
  // 승인
  const onApproval = useCallback(() => {
    checkMentorMutation.mutate(
      { approved: true, id },
      {
        onSuccess: (data) => {
          showToast(data.message, 'success');
          queryclient.invalidateQueries({ queryKey: ['mentors', id] });
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      }
    );
  }, [checkMentorMutation, id, showToast, queryclient]);

  return (
    <>
      <div className={style.sessionbg}>
        <h4>
          멘토 프로필<span>멘토님의 기본 정보 입니다.</span>
        </h4>
        <div className={style.content}>
          <Image
            src={getImageUrl(data?.image)}
            alt={data?.name}
            height={120}
            width={120}
          />
          <div>
            <em>{data?.name}</em>
            <ul className={style.contentUl}>
              <li>
                닉네임<span>{data?.nickname}</span>
              </li>
              <li>
                이메일<span>{data?.email}</span>
              </li>
              <li>
                전화번호<span>{data?.phone}</span>
              </li>
              <li>
                현재상태<span>{data?.status}</span>
              </li>
              <li>
                신청일<span>{formatDate(data?.createdAt)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={style.sessionbg}>
        <h4>
          경력 정보<span>멘토님의 경력 정보 입니다.</span>
        </h4>
        <div className={style.content}>
          <ul className={style.contentUl}>
            <li>
              멘토링 희망분야<span>{data?.job}</span>
            </li>
            <li>
              경력 기간<span>{data?.career}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={style.sessionbg}>
        <h4>자기소개</h4>
        <div className={style.content}>{data?.introduce}</div>
      </div>
      <div className={style.sessionbg}>
        <h4>포트폴리오 링크</h4>
        <div className={style.content}>{data?.portfolio}</div>
      </div>
      <div className={style.button}>
        <Button
          type="button"
          width="80"
          height="40"
          bg="none"
          onClick={() => onPopup()}
        >
          거절
        </Button>
        <Button
          type="button"
          width="80"
          height="40"
          onClick={() => onApproval()}
        >
          승인
        </Button>
      </div>
      {popup && (
        <RejectModal closePop={closePop} title="멘토링 신청 거절">
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
        </RejectModal>
      )}
    </>
  );
}
