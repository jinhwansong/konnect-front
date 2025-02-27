import { IColumn, IGetSchedule, IGetProgram } from '@/type';
import { formatDate } from "@/util/formatDate";
import { formatDateTime } from '@/util/formatDateTime';
import { formatNumber } from "@/util/formatNumber";
import { stateus } from "@/util/status";
import Link from 'next/link';

export const column: IColumn<IGetProgram>[] = [
  { id: 1, name: '번호', render: (item: IGetProgram) => item?.id },

  { id: 2, name: '제목', render: (item: IGetProgram) => item?.title },
  {
    id: 3,
    name: '멘토링 시간',
    render: (item: IGetProgram) => item?.duration + '분',
  },
  {
    id: 4,
    name: '가격',
    render: (item: IGetProgram) => formatNumber(item?.price) + '원',
  },

  {
    id: 5,
    name: '상태',
    render: (item: IGetProgram) => stateus(item?.status),
  },
  {
    id: 6,
    name: '평점',
    render: (item: IGetProgram) => {
      const rating = formatNumber(item?.totalReviews);
      return `${item?.averageRating} (${rating})`;
    },
  },
  {
    id: 7,
    name: '등록일',
    render: (item: IGetProgram) => formatDate(item?.createdAt),
  },
];
export const getStatus = {
  confirmed: '대기중',
  progress: '수락',
  completed: '완료',
  cancelled: '취소',
} as const;
export const scheduleColumn: IColumn<IGetSchedule>[] = [
  {
    id: 1,
    name: '상태',
    render: (item: IGetSchedule) => getStatus[item?.status],
  },
  { id: 2, name: '신청자', render: (item: IGetSchedule) => item?.name },
  {
    id: 3,
    name: '신청자 이메일',
    render: (item: IGetSchedule) => item.email,
  },
  {
    id: 4,
    name: '신청자 연락처',
    render: (item: IGetSchedule) => item?.phone,
  },
  {
    id: 5,
    name: '신청 강의명',
    render: (item: IGetSchedule) => item?.title,
  },
  {
    id: 6,
    name: '멘토링 일정',
    render: (item: IGetSchedule) => {
      const time = formatDate(item.startTime);
      const start = formatDateTime(item.startTime);
      const end = formatDateTime(item.endTime);
      return `${time}, ${start} - ${end}`;
    },
  },
  {
    id: 7,
    name: '신청정보',
    render: (item: IGetSchedule) => {
      return (
        <Link
          href={`/mentor/schedule/${item.id}`}
        >
          상세정보
        </Link>
      );
    },
  },
];
