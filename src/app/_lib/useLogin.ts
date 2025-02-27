'use server';
import { cookies } from 'next/headers';
import * as cookie from 'cookie';

export const onSubmit = async (prevState: any, formData: FormData) => {
  if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
    return { message: '아이디를 적어주세요' };
  }
  if (
    !formData.get('password') ||
    !(formData.get('password') as string)?.trim()
  ) {
    return { message: '비밀번호를 적어주세요' };
  }
  const formDataObject = Object.fromEntries(formData);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
      }
    );
    // 응답 헤더에서 Set-Cookie 확인
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const parsed = cookie.parse(setCookieHeader);
      const sessionId = parsed['connect.sid'];
      if (sessionId) {
        cookies().set('connect.sid', sessionId, parsed); 
      }
    }
    
    const data = await response.json();
    if (!response.ok) return { message: '아이디 또는 비밀번호가 일치하지 않습니다' };
    return { ok: true, data };
  } catch (error) {
    return { message: error };
  }
};
