'use client'
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import usePage from '@/hooks/usePage';
import Pagenation from '@/app/_component/Pagenation';
import { getReservation } from '@/app/_lib/useUser';
import { FaStar } from 'react-icons/fa';
import { formatDate } from '@/util/formatDate';
import { formatTime } from '@/util/formatTime';
import { formatDateTime } from '@/util/formatDateTime';
import { useToastStore } from '@/store/useToastStore';
import { usePopupStore } from '@/store/usePopupStore';
import RejectModal from '@/app/(client)/_component/RejectModal';
import style from './mentoring.module.scss';
import useInput from '@/hooks/useInput';
import Button from '@/app/_component/Button';
import { StatusType } from '@/type';

interface IMentoring {
  duration: number;
  id: number;
  mentor: string;
  startTime: string;
  status: StatusType;
  title: string;
}
interface IMentorings {
  items: IMentoring[];
  message: string;
  totalPage: number;
}
const getStatus = {
  confirmed: '대기중',
  progress: '예약확정',
  completed: '멘토링 완료',
  cancelled: '예약취소',
} as const;
const statusStyle = {
  confirmed: style.confirmed,
  progress: style.progress,
  completed: style.completed,
  cancelled: style.cancelled,
} as const;
export default function MentoringPage() {
  const router = useRouter();
  const { showToast } = useToastStore((state) => state);
  const { popup2, onPopup2, closePop } = usePopupStore();
  const { onPrevPage, onNextPage, onPage, currentPage } = usePage();
  const { data } = useQuery<IMentorings>({
    queryKey: ['reservation', currentPage],
    queryFn: () => getReservation(currentPage),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  // 미팅버튼
  const onMetting = useCallback(
    (status: StatusType) => {
      if (status === 'confirmed')
        return showToast('멘토 수락 후 참여 가능합니다', 'error');
      return router.push('/');
    },
    [router, showToast]
  );
  // 일정변경버튼
  const onChangeDay = useCallback(
    (status: StatusType) => {
      if (status === 'confirmed')
        return showToast('멘토 수락 후 변경 가능합니다', 'error');
      return router.push('/');
    },
    [router, showToast]
  );
  // 리뷰버튼
  const [review, changeReview] = useInput('');
  const onReviews = useCallback(() => {
    onPopup2();
  }, [onPopup2]);
  
  // 별점
  const [rating, setRating] = useState(0)
  const onRating = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, star:number) => {
      // 모형 가져오기
      const rect = e.currentTarget.getBoundingClientRect();
      const helfWidth = rect.width / 2;
      const isHalfStar = e.clientX - rect.left < helfWidth;
      setRating(isHalfStar ? star - 0.5 : star);
    },
    []
  );
  const getStartWidth = (currentStar:number, ratings:number) => {
    if (ratings >= currentStar) return '100%';
    if (ratings >= currentStar - 0.5) return '50%';
    return '0%'
  }
  return (
    <section className={style.mentoring_section}>
      <h4 className={style.mentoring_title}>멘토링 신청내역</h4>
      <ul className={style.mentor}>
        {data?.items.map((item) => (
          <li key={item.id}>
            <div className={style.mentor_left}>
              <div className={style.status_wrap}>
                <em className={`${style.status} ${statusStyle[item.status]}`}>
                  {getStatus[item.status]}
                </em>
                <p>예정일시</p>
                <span>
                  {formatDate(item.startTime.split('T')[0])}{' '}
                  {formatDateTime(item.startTime)}
                </span>
              </div>
              <p>{item.title}</p>
            </div>
            <div className={style.mentor_mid}>
              <p>
                <span>멘토명</span> {item.mentor}
              </p>
              <p>
                <span>1회 멘토링</span> {formatTime(item.duration)}
              </p>
            </div>
            <div className={style.mentor_right}>
              {item.status === 'progress' ||
                (item.status === 'confirmed' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onMetting(item.status)}
                    >
                      미팅참여
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeDay(item.status)}
                    >
                      일정변경
                    </button>
                  </>
                ))}
              {item.status === 'completed' && (
                <>
                  <button onClick={() => onReviews()}>후기작성</button>
                  <Link href={`/user/mentorings/${item.id}`}>채팅 내역</Link>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Pagenation
        totalPage={data?.totalPage as number}
        currentPage={currentPage}
        onPage={onPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
      {popup2 && (
        <RejectModal closePop={closePop} title="멘토링은 어떠셨나요?">
          <form className={style.review}>
            <div className={style.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onRating(e, star)
                  }
                  onMouseMove={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onRating(e, star)
                  }
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onRating(e, star)
                  }
                >
                  <FaStar />
                  <div
                    className={style.star_fill}
                    style={{ width: getStartWidth(star, rating) }}
                  >
                    <FaStar />
                  </div>
                </button>
              ))}
            </div>
            <textarea
              placeholder="수강평을 적어보세요"
              value={review}
              onChange={changeReview}
              className={style.textarea}
              rows={5}
            />
            <div className={style.button_warp}>
              <Button type="button" onClick={closePop} bg="line">
                취소
              </Button>
              <Button type="submit">저장하기</Button>
            </div>
          </form>
        </RejectModal>
      )}
    </section>
  );
}
