import { NextRequest } from 'next/server';

import { auth } from '@/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return proxy(req);
}
export async function POST(req: NextRequest) {
  return proxy(req);
}
export async function PATCH(req: NextRequest) {
  return proxy(req);
}
export async function DELETE(req: NextRequest) {
  return proxy(req);
}

async function proxy(req: NextRequest): Promise<Response> {
  const backendUrl = process.env.NEXT_PUBLIC_AUTH_URL!;

  // 세션에서 accessToken 가져오기
  const session = await auth();
  const token = session?.accessToken;

  const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, '');
  const url = `${backendUrl}${path}${req.nextUrl.search}`;

  // 헤더 복사
  const headers = new Headers(req.headers);
  headers.set('host', new URL(backendUrl).host);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  // fetch를 그대로 넘김
  const res = await fetch(url, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    redirect: 'manual',
    ...(req.method !== 'GET' && req.method !== 'HEAD'
      ? { duplex: 'half' }
      : {}),
  });

  // const responseBody = await res.arrayBuffer();

  // return new Response(responseBody, {
  //   status: res.status,
  //   headers: res.headers,
  // });
  const responseHeaders = new Headers(res.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  return new Response(res.body, {
    status: res.status,
    headers: responseHeaders,
  });
}
