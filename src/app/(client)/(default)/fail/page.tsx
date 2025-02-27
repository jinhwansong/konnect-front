'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function FailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 적절한 페이지로 리다이렉트
    setTimeout(() => {
      router.back();
    }, 3000);
  }, [router]);

  return (
    <div>
      <h2>결제 실패</h2>
      <p>{searchParams.get('message')}</p>
      <p>잠시 후 이전 페이지로 이동합니다...</p>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailPageContent />
    </Suspense>
  );
}
