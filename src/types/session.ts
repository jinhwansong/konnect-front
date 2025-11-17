export interface SessionItem {
  id: string;
  title: string;
  price: number;
  duration: number;
  rating: number;
  public: boolean;
  createdAt: string;
}
export interface SessionResponse {
  data: SessionItem[];
  totalPages: number;
}
export interface SessionDetailResponse extends SessionItem {
  category: string;
  description: string;
}

export interface SessionRequest {
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export interface PatchSession {
  id: string;
  data: SessionRequest;
}
