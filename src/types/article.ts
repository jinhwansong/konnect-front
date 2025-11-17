export interface ArticleCardItem {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  views: number;
  likeCount: number;
  liked?: boolean;
  author: {
    id: string;
    nickname: string;
    image: string;
  };
  category: string;
}

export interface ArticleResponse {
  totalPages: number;
  data: ArticleCardItem[];
}

export interface ArticleRequest {
  title: string;
  content: string;
  thumbnail?: FileList;
  category: string;
}

export interface PatchArticle {
  id: string;
  data: ArticleRequest;
}

export interface Author {
  nickname: string;
  image?: string;
}

export interface PatchComment {
  id: string;
  content: string;
}
export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  children?: CommentItem[];
}

export interface CommentRequest {
  data: CommentItem[];
  totalPage: number;
  message: string;
  totalAll: number;
}

export interface PostComment {
  content: string;
  parentId?: string;
}
