'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

/**
 * 관리자 사용자를 자동으로 대시보드로 리다이렉트하는 컴포넌트
 * 소셜 로그인 등 callbackUrl을 통해 메인 페이지로 온 경우 처리
 */
export default function AdminRedirect() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [session, router]);

  return null;
}

