export interface Notification {
  id: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// getUnreadCount
export interface UnreadCountResponse {
  count: number;
}
