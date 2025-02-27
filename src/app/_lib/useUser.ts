'use client';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';


// 내 정보
export const useUserData = () => {
  return useQuery({
    queryKey: ['mydata'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const res = await response.json();
      return res;
    },
  });
};
export const useUpdatePhone = () => {
  return useMutation({
    mutationFn: async (phone: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/phone`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
};
export const useUpdateNickname = () => {
  return useMutation({
    mutationFn: async (nickname: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/nickname`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
};
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (image: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: image,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
};
interface IPassword {
  currentPassword: string;
  newPassword: string;
}
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: IPassword) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/password`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
};

// 결제/환불내역
export const getPayment = async (page: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments?page=${page}&limit=10`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
};

export const useRefund = () => {
  return useMutation({
    mutationFn: async (paymentKey: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/cancel`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
};

// 멘토링 신청내역
export const getReservation = async (page: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation?page=${page}&limit=10`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
};