import {
  SessionDetailResponse,
  SessionRequest,
  SessionResponse,
} from '@/types/session';
import { fetcher } from '@/utils/fetcher';

export const fetchSessions = async (page: number): Promise<SessionResponse> => {
  return fetcher<SessionResponse>(`mentoring?page=${page}&limit=10`, {
    method: 'GET',
  });
};

export const fetchSessionDetail = async (
  id: string
): Promise<SessionDetailResponse> => {
  return fetcher<SessionDetailResponse>(`mentoring/${id}`, {
    method: 'GET',
  });
};

export const updateSessionVisibility = async (
  id: string,
  isPublic: boolean
) => {
  return fetcher(`mentoring/${id}/public`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublic: !isPublic }),
  });
};

export const removeSession = async (id: string) => {
  return fetcher(`mentoring/${id}`, {
    method: 'DELETE',
  });
};

export const updateSession = async (id: string, data: SessionRequest) => {
  return fetcher<SessionRequest>(`mentoring/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const createSession = async (data: SessionRequest) => {
  return fetcher<SessionRequest>(`mentoring`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const uploadSessionImage = (
  formData: FormData
): Promise<{ urls: string[] }> => {
  return fetcher<{ urls: string[] }>('mentoring/upload-image', {
    method: 'POST',
    body: formData,
  });
};
