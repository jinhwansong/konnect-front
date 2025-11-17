import {
  ChatMessageListResponse,
  GetRoomMessagesParams,
  IssueWebRTCTokenParams,
  IssueWebRTCTokenResponse,
  JoinRoomResponse,
  SendMessageParams,
  SendMessageResponse,
} from '@/types/chat';
import { fetcher } from '@/utils/fetcher';

export const joinRoomRequest = (id: string) => {
  return fetcher<JoinRoomResponse>(`reservation/joinRoom/${id}`, {
    method: 'POST',
  });
};

export const getRoomMessages = async ({
  roomId,
  cursor,
  limit = 20,
}: GetRoomMessagesParams): Promise<ChatMessageListResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    ...(cursor && { cursor }),
  });

  return fetcher<ChatMessageListResponse>(
    `chat/rooms/${roomId}/messages?${params}`,
    {
      method: 'GET',
    }
  );
};

export const sendMessage = async ({
  roomId,
  message,
  fileUrl,
  fileName,
}: SendMessageParams): Promise<SendMessageResponse> => {
  return fetcher<SendMessageResponse>(`chat/rooms/${roomId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      fileUrl,
      fileName,
    }),
  });
};

export const issueWebRTCToken = async ({
  roomId,
}: IssueWebRTCTokenParams): Promise<IssueWebRTCTokenResponse> => {
  return fetcher<IssueWebRTCTokenResponse>('chat/webrtc/token', {
    method: 'POST',
    body: JSON.stringify({ roomId }),
  });
};
