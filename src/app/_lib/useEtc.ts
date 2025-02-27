import { IfetchProgram } from '@/type';
import { useMutation } from '@tanstack/react-query';
import { notFound } from 'next/navigation';


// 메인 프로그램 
export async function fetchProgram({
  page,
  limit,
  sort,
  mentoring_field,
}: IfetchProgram) {
   if (process.env.NODE_ENV === 'production') {
     return {
       items: [],
       totalPage: 0,
       message: '데이터를 불러올 수 없습니다.',
     };
   }
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/programs?page=${page}&limit=${limit}&sort=${sort}&mentoring_field=${decodeURIComponent(
        mentoring_field
      )}`,
      {
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // 에러를 다시 던져서 error.tsx에서 처리하도록 함
  }
}
export async function fetchProgramDetail(id:number) {
   if (process.env.NODE_ENV === 'production') {
     return {
       items: [],
       totalPage: 0,
       message: '데이터를 불러올 수 없습니다.',
     };
   }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/programs/${id}`,
      {
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


// 날짜
interface IDays {
  year: number;
  month: number;
  id: number;
}
interface ITime extends IDays {
  day: number;
}
export const getAvailableDays = async ({ year, month, id }: IDays) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/programs/${id}/month?year=${year}&month=${month}`,
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
export const getAvailableTime = async ({ year, month, day, id }: ITime) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/programs/${id}/times?year=${year}&month=${month}&day=${day}`,
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

// 회원가입
export const useCheckEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/checkEmail`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
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
export const useCheckNickname = () => {
  return useMutation({
    mutationFn: async (nickname: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/checkNickname`,
        {
          method: 'POST',
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

// 로그아웃
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`,
        {
          method: 'POST',
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
