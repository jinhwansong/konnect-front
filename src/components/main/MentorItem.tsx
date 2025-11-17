import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiBriefcase } from 'react-icons/fi';

import { CAREER_OPTIONS, POSITION_OPTIONS } from '@/contact/apply';
import { careerIconMap, positionIconMap } from '@/contact/mentoring';
import { SessionItem } from '@/types/main';
import { formatMinutesToKorean } from '@/utils/formatDuration';
import { formatToKoreanWon } from '@/utils/formatPrice';
import { buildImageUrl } from '@/utils/getImageUrl';
import { findOptionLabel } from '@/utils/getLabel';

export default function MentorItem(props: SessionItem) {
  return (
    <Link
      href={`/mentors/${props.id}`}
      className="rounded-lg border border-[var(--border-color)] p-5 shadow transition duration-200 hover:-translate-y-3 hover:shadow-md"
    >
      <em className="mb-2.5 line-clamp-2 block h-12 font-semibold break-words text-[var(--text-bold)]">
        {props.title}
      </em>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <em className="block text-sm text-[var(--text-bold)]">
            {props.mentor.nickname}
          </em>
          <ul>
            <li className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--text-bold)]">
              <span className="text-[var(--background-sub01)]">
                {positionIconMap[props.mentor.position]}
              </span>{' '}
              <span>
                {findOptionLabel(props.mentor.position, POSITION_OPTIONS)}
              </span>
            </li>
            <li className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-bold)]">
              <span className="text-[var(--background-sub01)]">
                {careerIconMap[props.mentor.career]}
              </span>
              <span>
                {findOptionLabel(props.mentor.career, CAREER_OPTIONS)}
              </span>
            </li>
            {props.mentor.company !== '비공개' && (
              <li className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
                <span>
                  <FiBriefcase />
                </span>
                <span>{props.mentor.company}</span>
              </li>
            )}
          </ul>
        </div>
        <Image
          src={buildImageUrl(props.mentor.image)}
          width={40}
          height={40}
          alt={props.title}
          className="border-[var( --border-color)] h-10 w-10 rounded-full border"
        />
      </div>
      <div className="mt-3 border-t border-[var(--border-color)] pt-3">
        <p className="line-clamp-3 text-sm break-words">{props.description}</p>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span>{formatMinutesToKorean(props.duration)}</span>
        <span>{formatToKoreanWon(props.price)}</span>
      </div>
      <div className="mt-5 h-11 w-full rounded-full border border-[var(--border-color)] text-center text-sm leading-10 transition-colors duration-200 hover:bg-[var(--primary)] hover:text-white">
        1:1 상담 신청
      </div>
    </Link>
  );
}
