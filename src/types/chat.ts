export interface ChatUser {
  id: string;
  name: string;
  image?: string;
  isMentor: boolean;
  isConnected?: boolean;
  socketId?: string;
  roomId?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: ChatUser;
  message: string;
  type: 'text' | 'system' | 'file';
  fileUrl?: string;
  fileName?: string;
  createdAt: Date | string;
}

// 무한스크롤용 응답 타입
export interface ChatMessageListResponse {
  data: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
  count: number;
}

// 웹소켓용 레거시 타입 (호환성 유지)
export interface ChatMessageLegacy {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  isMentor: boolean;
  message: string;
  type: 'text' | 'system' | 'file';
  fileUrl?: string;
  fileName?: string;
  timestamp: Date | string;
  roomId: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

export interface LeaveRoomPayload {
  roomId: string;
}

export interface SendMessagePayload {
  roomId: string;
  message: string;
  type?: 'text' | 'system' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface UserConnectedEvent {
  userId: string;
  userName: string;
  userImage?: string;
  isMentor: boolean;
  socketId: string;
}

export interface UserDisconnectedEvent {
  userId: string;
  userName: string;
  socketId: string;
}

export interface JoinSuccessEvent {
  roomId: string;
  userId: string;
}

export interface JoinDeniedEvent {
  reason:
    | 'INVALID_TOKEN'
    | 'RESERVATION_NOT_FOUND'
    | 'NOT_IN_TIME_WINDOW'
    | 'NOT_PARTICIPANT'
    | 'SERVER_ERROR';
}

export interface JoinRoomResponse {
  status: 'waiting' | 'progress' | 'closed';
  roomId: string;
}

export interface SendMessageParams {
  roomId: string;
  message: string;
  fileUrl?: string;
  fileName?: string;
}

export interface SendMessageResponse {
  id: string;
  roomId: string;
  userId: string;
  message: string;
  createdAt: string;
  fileUrl?: string;
  fileName?: string;
}

export interface IssueWebRTCTokenParams {
  roomId: string;
}

export interface IssueWebRTCTokenResponse {
  roomId: string;
  userId: string;
  token: string;
  expiresIn: number;
}

export interface GetRoomMessagesParams {
  roomId: string;
  cursor?: string;
  limit?: number;
}
