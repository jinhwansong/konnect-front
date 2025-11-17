import Image from 'next/image';
import { JSX } from 'react';
import {
  FiLayers,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiZap,
  FiBarChart2,
  FiAward,
  FiStar,
  FiDatabase,
  FiMonitor,
  FiSmartphone,
  FiServer,
  FiShield,
  FiHardDrive,
  FiClipboard,
  FiFileText,
  FiUserCheck,
  FiPenTool,
  FiHeadphones,
  FiMoreHorizontal,
} from 'react-icons/fi';

import { Option } from '@/types/apply';

import { CAREER_OPTIONS, POSITION_OPTIONS } from './apply';

export enum MentoringCategory {
  BUSINESS = 'business', // 경영/전략/기획
  MARKETING = 'marketing', // 마케팅/광고/브랜딩/PR
  SALES = 'sales', // 영업/MD/유통
  FINANCE = 'finance', // 재무/회계/금융
  HR = 'hr', // 인사/노무/총무
  IT = 'it', // 웹/앱 개발, 데이터/AI, 인프라
  DESIGN = 'design', // UX/UI, 그래픽, 영상/모션
  CONSULTING = 'consulting', // 컨설팅/전문서비스/교육
  MANUFACTURING = 'manufacturing', // 제조/생산/품질/기술직
  ETC = 'etc', // 기타 직무
}
export type CategoryTabType = 'all' | MentoringCategory;

interface CategoryConfig {
  label: string;
  icon: JSX.Element;
}

export const categoryIcons: Record<CategoryTabType, CategoryConfig> = {
  all: {
    label: '전체',
    icon: <Image src="/icon/etc.svg" alt="전체" width={50} height={50} />,
  },
  business: {
    label: '경영/전략/기획',
    icon: <Image src="/icon/business.svg" alt="경영" width={50} height={50} />,
  },
  marketing: {
    label: '마케팅/광고/PR',
    icon: (
      <Image src="/icon/marketing.svg" alt="마케팅" width={50} height={50} />
    ),
  },
  sales: {
    label: '영업/MD',
    icon: <Image src="/icon/sales.svg" alt="영업" width={50} height={50} />,
  },
  finance: {
    label: '재무/회계',
    icon: <Image src="/icon/finance.svg" alt="재무" width={50} height={50} />,
  },
  hr: {
    label: '인사/노무',
    icon: <Image src="/icon/hr.svg" alt="인사" width={50} height={50} />,
  },
  it: {
    label: '개발/데이터',
    icon: <Image src="/icon/it.svg" alt="개발" width={50} height={50} />,
  },
  design: {
    label: '디자인/UXUI',
    icon: <Image src="/icon/design.svg" alt="디자인" width={50} height={50} />,
  },
  consulting: {
    label: '컨설팅/교육',
    icon: (
      <Image src="/icon/consulting.svg" alt="컨설팅" width={50} height={50} />
    ),
  },
  manufacturing: {
    label: '제조/품질',
    icon: (
      <Image
        src="/icon/manufacturing.svg"
        alt="제조/품질"
        width={50}
        height={50}
      />
    ),
  },
  etc: {
    label: '기타',
    icon: <Image src="/icon/etc.svg" alt="기타" width={50} height={50} />,
  },
};

export type MentoringSortType =
  | 'latest'
  | 'rating'
  | 'reviews'
  | 'likes'
  | 'mentor'
  | 'priceAsc'
  | 'priceDesc';

export const mentoringSortOptions: Option<MentoringSortType>[] = [
  { label: '최신순', value: 'latest' },
  { label: '평점순', value: 'rating' },
  { label: '리뷰순', value: 'reviews' },
  { label: '좋아요순', value: 'likes' },
  { label: '멘토가입순', value: 'mentor' },
  { label: '가격 낮은 순', value: 'priceAsc' },
  { label: '가격 높은 순', value: 'priceDesc' },
];

export const EXPERTISE_OPTIONS = [
  { label: '경영/전략/기획', value: MentoringCategory.BUSINESS },
  { label: '마케팅/광고/홍보', value: MentoringCategory.MARKETING },
  { label: '영업/MD/유통', value: MentoringCategory.SALES },
  { label: '재무/회계/금융', value: MentoringCategory.FINANCE },
  { label: '인사/총무/노무', value: MentoringCategory.HR },
  { label: '개발/데이터/IT', value: MentoringCategory.IT },
  { label: '디자인/UX·UI', value: MentoringCategory.DESIGN },
  { label: '교육/상담/컨설팅', value: MentoringCategory.CONSULTING },
  { label: '제조/생산/품질', value: MentoringCategory.MANUFACTURING },
  { label: '기타', value: MentoringCategory.ETC },
];

export const MENTORING_OPTION_ALL: Option<CategoryTabType>[] = [
  { label: '전체', value: 'all' },
  ...EXPERTISE_OPTIONS,
];

type CareerValue = (typeof CAREER_OPTIONS)[number]['value'];
export const careerIconMap: Record<CareerValue, JSX.Element> = {
  junior: <FiZap />,
  middle: <FiBarChart2 />,
  senior: <FiAward />,
  lead: <FiStar />,
};

type PositionValue = (typeof POSITION_OPTIONS)[number]['value'];
export const positionIconMap: Record<PositionValue, JSX.Element> = {
  backend: <FiDatabase />, // 백엔드
  frontend: <FiMonitor />, // 프론트엔드
  fullstack: <FiLayers />, // 풀스택
  mobile: <FiSmartphone />, // 모바일
  devops: <FiServer />, // DevOps
  security: <FiShield />, // 보안
  data_engineer: <FiHardDrive />, // 데이터 엔지니어
  data_scientist: <FiBarChart2 />, // 데이터 사이언티스트
  pm_po: <FiClipboard />, // PM/PO
  planner: <FiFileText />, // 기획자
  ux_designer: <FiUserCheck />, // UX 디자이너
  ui_designer: <FiPenTool />, // UI 디자이너
  marketing: <FiTrendingUp />, // 마케터
  hr: <FiUsers />, // 인사
  cs: <FiHeadphones />, // 고객지원
  finance: <FiDollarSign />, // 재무
  etc: <FiMoreHorizontal />, // 기타
};
