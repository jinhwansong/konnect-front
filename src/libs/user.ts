import { User } from 'next-auth';

import { MessageResponse } from '@/types/user';
import { fetcher } from '@/utils/fetcher';

export const logout = async (): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`auth/logout`, {
    method: 'POST',
  });
};

interface SocialLoginPayload {
  provider?: string;
  socialId?: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export async function socialLogin(data: SocialLoginPayload): Promise<User> {
  return fetcher(`auth/social`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export const login = async (email: string, password: string): Promise<User> => {
  return fetcher<User>('auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};
