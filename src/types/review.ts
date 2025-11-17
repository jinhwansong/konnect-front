export interface Reviews {
  rating: number;
  content: string;
}

export interface ReviewRequest extends Reviews {
  reservationId: string;
}

export interface PatchReview {
  id: string;
  data: Reviews;
}

interface ReviewBase {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  sessionTitle: string;
}

export interface ReviewMentorItem extends ReviewBase {
  menteeName: string;
}

export interface ReviewMenteeItem extends ReviewBase {
  mentorName: string;
}

export interface ReviewResponse {
  message: string;
  totalPage: number;
  data: ReviewMenteeItem[] | ReviewMentorItem[];
}
