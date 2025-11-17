import {
  MessageResponse,
  UserRegistrationRequest,
  SendEmailVerificationRequest,
  VerifyEmailCodeRequest,
} from '@/types/user';
import { fetcher } from '@/utils/fetcher';

export const checkEmailAvailability = (
  email: string
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>('auth/duplicateEmail', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const checkNicknameAvailability = (
  nickname: string
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>('auth/duplicateNickname', {
    method: 'POST',
    body: JSON.stringify({ nickname }),
  });
};

export const sendEmailVerification = (
  data: SendEmailVerificationRequest
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>('auth/email/verify/send', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const postEmailCodeVerification = (
  data: VerifyEmailCodeRequest
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>('auth/email/verify/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const createUser = (
  data: UserRegistrationRequest
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>('auth/join', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
