import React from 'react';

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Konnect Demo Accounts</h1>

      <p className="mb-2">테스트용 계정은 아래 정보를 사용해주세요.</p>

      <ul className="space-y-2">
        <li>
          <strong>멘티:</strong> song7022556@gmail.com / qwer1234!
        </li>
        <li>
          <strong>멘토:</strong> song7022556@naver.com / qwer1234!
        </li>
        <li>
          <strong>관리자:</strong> admin@naver.com / admin123!#
        </li>
      </ul>
    </main>
  );
}
