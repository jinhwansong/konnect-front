import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
  // 관리자 페이지 경로체크
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // 인증체크
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // 여기에 명시적 return 추가
    return NextResponse.next();
  }
};

async function checkAdmin(req: NextRequest) {
  // 세션 확인
  const session = req.cookies.get('connect.sid');

  if (!session) return false;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${session?.value}`,
      },
    });
    if (!res.ok) {
      console.error('API 응답 오류:', res.status);
      return false;
    }
    const data = await res.json();
    return data.role === 'admin';
  } catch (error) {
    return false;
  }
}

// /admin으로 시작하는 모든 경로
export const config = {
  matcher: ['/admin/:path*', '/admin'],
  runtime: 'nodejs',
};
