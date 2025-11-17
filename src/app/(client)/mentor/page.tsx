'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { BiCaretDown } from 'react-icons/bi';

import { FAQ_OPTIONS, REASON_OPTIONS } from '@/contact/mentor';

export default function MentorPage() {
  const router = useRouter();
  const { data: sessions } = useSession();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const onToggle = (id: number) => {
    setOpenIndex(prev => (prev === id ? null : id));
  };
  const onRouter = () => {
    if (!sessions) {
      return router.push('/login');
    }
    router.push('/mentor/apply');
  };
  return (
    <section>
      <article className="relative">
        <Image
          src="/main/ImgMentorbg.jpg"
          alt="배경"
          width={1920}
          height={500}
          className="object-cover"
        />
        <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2">
          <h4 className="mb-4 text-center text-2xl leading-[1.3] font-bold text-[#222]">
            지식 공유의 새로운 길,
            <br /> 1:1 맞춤 멘토링을 시작하세요
          </h4>
          <p className="text-center text-lg leading-[1.4] text-[#555]">
            시니어부터 주니어까지, 모든 경험은 값진 지식이 됩니다,
            <br /> 나만의 노하우를 공유하며 함께 성장하는 멘토링을 시작해보세요
          </p>
          <button
            onClick={onRouter}
            className="shadow-[0_6px_16px_rgba(99, 102, 241, 0.4)] mx-auto mt-5 block h-[65px] w-[200px] rounded-full bg-[linear-gradient(90deg,_#6366f1,_#8b5cf6_51%,_#4f46e5)] bg-[length:200%_auto] text-center leading-[65px] font-semibold text-white transition-all duration-500"
          >
            멘토 지원하기
          </button>
        </div>
      </article>
      <article className="mx-auto md:w-[768px] lg:w-[1200px]">
        <span className="mt-12 mb-2 block text-center text-sm leading-px font-medium">
          지금 시작해야 하는 이유
        </span>
        <h4 className="mb-6 text-center text-2xl font-bold text-[var(--text-bold)]">
          이런 점이 좋아요!
        </h4>
        <ul className="grid grid-cols-2 gap-4">
          {REASON_OPTIONS.map((reasons, i) => (
            <li
              key={i}
              className={clsx(
                'rounded-lg border border-[var(--border-color)]',
                'bg-[var(--background)] px-8 py-10 text-center',
                'transition hover:bg-[var(--hover-bg)] hover:shadow-md'
              )}
            >
              <Image
                src={reasons.img}
                alt={reasons.title}
                width={72}
                height={72}
                className="mx-auto block"
              />
              <em className="mt-5 mb-2.5 block font-bold text-[var(--text-bold)]">
                {reasons.title}
              </em>
              <p className="text-sm leading-[1.4] text-[var(--text-sub)]">
                {reasons.content}
              </p>
            </li>
          ))}
        </ul>
      </article>
      <article className="mx-auto mb-16 md:w-[768px] lg:w-[1200px]">
        <h4 className="mt-12 mb-6 text-center text-2xl font-bold text-[var(--text-bold)]">
          자주 묻는 질문
        </h4>
        {FAQ_OPTIONS.map(faqs => (
          <button
            key={faqs.id}
            onClick={() => onToggle(faqs.id)}
            className={clsx(
              'mt-5 w-full rounded-[1rem]',
              'bg-[var(--hover-bg)]',
              'p-7 text-left transition-colors'
            )}
          >
            <details
              open={openIndex === faqs.id}
              onClick={e => e.preventDefault()}
              className="group"
            >
              <summary className="relative font-medium text-[var(--text-bold)] marker:text-[0px]">
                <span className="text-[var(--primary-sub04)]">Q.</span>
                {faqs.question}
                <BiCaretDown className="absolute top-0 right-0 bottom-0 m-auto transition-transform duration-300 ease-in-out group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-[1.4] text-[var(--text-sub)]">
                {faqs.answer}
              </p>
            </details>
          </button>
        ))}
      </article>
    </section>
  );
}
