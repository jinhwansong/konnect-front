import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto mt-10 mb-16 md:w-[768px] lg:w-[1200px]">
      <h1 className="mb-6 text-3xl font-bold text-[var(--text-bold)]">
        개인정보처리방침
      </h1>

      <p className="mb-4">
        Konnect(이하 “회사”)는 이용자의 개인정보 보호를 매우 중요시하며,
        「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        1. 수집하는 개인정보 항목
      </h2>
      <ul className="mb-4 list-inside list-disc">
        <li>필수: 이메일, 이름, 비밀번호, IP주소, 쿠키</li>
        <li>선택: 프로필 이미지, SNS 계정, 결제 정보</li>
      </ul>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        2. 개인정보 수집 방법
      </h2>
      <p className="mb-4">
        회원가입, 서비스 이용, 문의 시 입력 또는 자동 수집됩니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        3. 이용 목적
      </h2>
      <ul className="mb-4 list-inside list-disc">
        <li>회원관리 및 서비스 제공</li>
        <li>결제 및 콘텐츠 제공</li>
        <li>문의 응대 및 공지 전달</li>
        <li>보안 및 부정이용 방지</li>
      </ul>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        4. 보유 및 이용기간
      </h2>
      <p className="mb-4">
        목적 달성 시 지체 없이 파기. 단, 관련 법령에 따라 일정 기간 보관될 수
        있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        5. 제3자 제공 및 위탁
      </h2>
      <p className="mb-4">
        동의 없이는 제공하지 않으며, 이메일 발송, 결제 대행 등에 일부 위탁할 수
        있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        6. 권리와 행사 방법
      </h2>
      <p className="mb-4">
        회원은 언제든지 개인정보 열람, 수정, 삭제, 탈퇴를 요청할 수 있습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold text-[var(--text)]">
        7. 개인정보 보호책임자
      </h2>
      <p>
        이름: 송진환
        <br />
        이메일: song7022556@gmail.com
      </p>
    </section>
  );
}
