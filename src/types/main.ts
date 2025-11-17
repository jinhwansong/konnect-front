interface SessionCommon {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
}

export interface SessionItem extends SessionCommon {
  previewReviews: {
    content: string;
    rating: number;
    createdAt: string;
    nickname: string;
  }[];
  mentor: {
    position: string;
    career: string;
    company: string;
    nickname: string;
    image: string;
  };

  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
}

export interface SessionResponse {
  totalPages: number;
  data: SessionItem[];
}

export interface SessionDetailResponse extends SessionCommon {
  category: string;
  rating: number;
  career: string;
  position: string;
  company: string;
  nickname: string;
  userId: string;
  image: string;
  createdAt: string;
}
