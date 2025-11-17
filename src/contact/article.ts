import { Option } from '@/types/apply';

enum ArticleCategory {
  CAREER = 'career', // 진로 설계, 직무 선택, 커리어 전환 이야기
  JOB = 'job', // 취업 준비, 이직 전략, 포트폴리오 작성 등
  STUDY = 'study', // 공부 방법, 학습 노하우, 자격증/시험 후기
  TECH = 'tech', // 실무 기술 공유, 툴 사용 팁, 개발/디자인 등
  LIFESTYLE = 'lifestyle', // 멘토의 일상, 루틴, 생산성 팁 등
  MENTORING = 'mentoring', // 실제 멘토링 사례, 느낀 점, QnA 정리
  STARTUP = 'startup', // 창업, 사이드 프로젝트, 스타트업 이야기
  PORTFOLIO = 'portfolio', // 	포트폴리오 작성/리뷰 관련 팁
  BOOK = 'book', // 	책 추천, 독서 후기, 학습 자료
  ETC = 'etc',
}
export type ArticleCategoryTabType = 'all' | ArticleCategory;

export const ARTICLE_OPTIONS: Option<ArticleCategoryTabType>[] = [
  { label: '진로 설계/직무 선택', value: ArticleCategory.CAREER },
  { label: '취업/이직/포트폴리오', value: ArticleCategory.JOB },
  { label: '공부/시험/자격증', value: ArticleCategory.STUDY },
  { label: '실무 기술/툴/개발', value: ArticleCategory.TECH },
  { label: '일상/루틴/생산성', value: ArticleCategory.LIFESTYLE },
  { label: '멘토링 후기/QnA', value: ArticleCategory.MENTORING },
  { label: '스타트업/사이드 프로젝트', value: ArticleCategory.STARTUP },
  { label: '포트폴리오 작성 팁', value: ArticleCategory.PORTFOLIO },
  { label: '책/독서/자료', value: ArticleCategory.BOOK },
  { label: '기타', value: ArticleCategory.ETC },
];

// 리스트 전용
export const ARTICLE_OPTION_ALL: Option<ArticleCategoryTabType>[] = [
  { label: '전체', value: 'all' },
  ...ARTICLE_OPTIONS,
];

export type ArticleSortType = 'latest' | 'likes';

export const ARTICLE_OPTION_SORT: Option<ArticleSortType>[] = [
  { label: '최신순', value: 'latest' },
  { label: '좋아요순', value: 'likes' },
];
