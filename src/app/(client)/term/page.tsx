import React from 'react';

export default function TermsPage() {
  return (
    <section className="mx-auto mt-10 mb-16 md:w-[768px] lg:w-[1200px]">
      <h1 className="mb-6 text-3xl font-bold text-[var(--text-bold)]">
        이용약관
      </h1>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제1조 목적
      </h2>
      <p className="mb-4">
        본 약관은 Konnect가 제공하는 서비스의 이용 조건 및 절차 등을 규정합니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제2조 용어 정의
      </h2>
      <p className="mb-4">
        “회원”이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제3조 약관의 효력 및 변경
      </h2>
      <p className="mb-4">
        약관은 공지 또는 동의 시 효력이 발생하며, 변경 시 사전 공지합니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제4조 회원가입
      </h2>
      <p className="mb-4">
        회원은 정해진 절차에 따라 가입하며, 회사는 가입을 거절할 수 있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제5조 회원의 의무
      </h2>
      <ul className="mb-4 list-inside list-disc">
        <li>관련 법령 및 회사 정책 준수</li>
        <li>타인 정보 도용 금지</li>
      </ul>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제6조 유료 서비스
      </h2>
      <p className="mb-4">
        일부 서비스는 유료이며, 결제 및 환불은 관련 정책에 따릅니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제7조 게시물 관리
      </h2>
      <p className="mb-4">
        부적절한 게시물은 삭제될 수 있으며, 책임은 작성자에게 있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제8조 계약 해지
      </h2>
      <p className="mb-4">
        회원은 언제든지 탈퇴 가능하며, 회사는 약관 위반 시 제한할 수 있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        제9조 분쟁 해결
      </h2>
      <p>대한민국 법률에 따르며, 관할 법원은 회사 소재지 법원으로 합니다.</p>
    </section>
  );
}
