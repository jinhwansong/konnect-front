import { Notification, UnreadCountResponse } from '@/types/notification';
import { MessageResponse } from '@/types/user';
import { fetcher } from '@/utils/fetcher';

export const fcm = async (currentToken: string): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`notification/fcm-token`, {
    method: 'PATCH',
    body: JSON.stringify({ token: currentToken }),
  });
};

export const removeFcm = async (token?: string): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`notification/fcm-token/${token}`, {
    method: 'DELETE',
  });
};

export const markAsRead = async (id: string): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`notification/${id}/read`, {
    method: 'PATCH',
  });
};

export const markAllAsRead = async (): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`notification/read/all`, {
    method: 'PATCH',
  });
};

export const deleteNotification = async (
  id: string
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`notification/${id}`, {
    method: 'DELETE',
  });
};

export const deleteAllNotifications = async (): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`notification/all`, {
    method: 'DELETE',
  });
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  return fetcher<UnreadCountResponse>(`notification/unread-count`);
};

export const fetchNotification = async (): Promise<Notification[]> => {
  return fetcher<Notification[]>(`notification`, {
    method: 'GET',
  });
};
