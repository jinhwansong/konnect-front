'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ICreateProgram, IMentorMutation, IModifyProgram } from '@/type';

// 멘토 정보
export const useMentor = () => {
  return useMutation({
    mutationFn: async ({
      email,
      job,
      introduce,
      portfolio,
      career,
    }: IMentorMutation) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            job,
            introduce,
            portfolio,
            career,
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
export const useMentorData = () => {
  return useQuery({
    queryKey: ['mentordata'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor`,
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
export const useUpdateCareer = () => {
  return useMutation({
    mutationFn: async (career: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor/career`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            career,
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
export const useUpdatePosition = () => {
  return useMutation({
    mutationFn: async (position: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor/position`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            position,
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor/profile`,
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
export const useUpdateCompony = () => {
  return useMutation({
    mutationFn: async (company: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor/company`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company,
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
export const useUpdateIntroduce = () => {
  return useMutation({
    mutationFn: async (introduce: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor/introduce`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            introduce,
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

// 멘토 프로그램 조회
export const getProgram = async (page: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring?page=${page}&limit=10`,
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
export const getDetailProgram = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring/${id}`,
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
export const useCreateProgram = () => {
  return useMutation({
    mutationFn: async ({
      title,
      content,
      price,
      duration,
      available_schedule,
      mentoring_field,
    }: ICreateProgram) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            price,
            duration,
            available_schedule,
            mentoring_field,
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
export const useModifyProgram = () => {
  return useMutation({
    mutationFn: async ({
      title,
      content,
      price,
      duration,
      available_schedule,
      id,
      mentoring_field,
    }: IModifyProgram) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring/${id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            price,
            duration,
            available_schedule,
            mentoring_field,
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
export const useDeleteProgram = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring/${id}`,
        {
          method: 'DELETE',
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
    },
  });
};

// 멘토링관리
export const getSchedule = async (page: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring/schedule?page=${page}&limit=10`,
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
export const getDetailSchedule = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentoring/schedule/${id}`,
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