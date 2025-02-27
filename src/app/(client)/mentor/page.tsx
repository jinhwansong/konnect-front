'use client'
import React, { useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/app/_lib/useUser';
import { IcInfo, IcMentorbg, IcNetwork, IcRate, IcShare } from '@/asset';
import FaqItem from './_component/FaqItem';
import style from './mento.module.scss';


export default function Page() {
  const router = useRouter();
  const { data } = useUserData();
  const faq = [
    {
      id: 1,
      question: '멘토링이 뭔가요?',
      answer: (
        <>
          멘토와 멘티를 1:1로 연결해 약속을 잡아주는 기능이에요.
          <br /> 멘토(지식공유자)가 가능한 시간과 비용을 설정해두면 멘티는
          원하는 스케줄에 멘토링을 신청할 수 있어요.
        </>
      ),
    },
    {
      id: 2,
      question: ' 멘토가 되려면 어떻게 하나요?',
      answer: (
        <>
          지식공유자라면 누구든지 멘토가 될 수있어요.
          <br />
          멘토링 설정 페이지에서 멘토링 내용을 작성하고, 멘토링을 ON으로변경해
          주세요.
        </>
      ),
    },
    {
      id: 3,
      question: '멘토링을 어떻게 활용할 수 있을까요?',
      answer: (
        <>
          커리어 상담, 코드 리뷰, 포트폴리오 리뷰, 작업물 검토, 기술 컨설팅, 1:1
          과외 등등
          <br /> 가지고 있는 지식을 다른 누군가와 나눌 목적이라면 다양하게
          활용하실 수 있어요.
        </>
      ),
    },
    {
      id: 4,
      question: '멘토링은 어떻게 확정되나요?',
      answer: (
        <>
          멘토링 신청이 들어온 후 24시간 이내 수락을 진행하면 멘토링이
          확정됩니다.
        </>
      ),
    },
    {
      id: 5,
      question: '멘토링은 시간은 어떻게 되나요?',
      answer: (
        <>
          기본 1회 멘토링은 1시간 동안 진행되며, 멘토와 협의하에 시간 조정이
          가능합니다.
          <br /> 주중/주말 모두 가능하며 구체적인 일정은 매칭 후 조율됩니다.
        </>
      ),
    },
    {
      id: 6,
      question:
        '멘토링을 수락했는데 급한 일이 생겼어요! 수락 후 취소가 되나요?',
      answer: (
        <>
          멘토링이 수락된 경우라도 멘토, 멘티 모두 멘토링을 취소할 수 있어요.
          <br />
          취소 시 환불은 내부 규정에 따라 처리됩니다.
        </>
      ),
    },
  ];
  const reason = [
    {
      title: '강의보다 쉬운 지식공유 수단',
      img: <Image src={IcShare} alt="강의보다 쉬운 지식공유 수단" />,
      content: (
        <>
          강의 기획하고, 촬영하고 편집하고... 막막하신가요?
          <br /> 멘토링부터 시작해보는 건 어떨까요?
        </>
      ),
    },
    {
      title: '추가 수입과 시간 활용',
      img: <Image src={IcRate} alt="추가 수입과 시간 활용" />,
      content: (
        <>
          본업 외 전문성을 활용한 부수입 창출 및<br /> 자유로운 시간대 설정으로
          효율적으로 시간을 활용할 수 있어요.
        </>
      ),
    },
    {
      title: '전문지식을 다듬을 수 있는 기회',
      img: <Image src={IcInfo} alt="전문지식을 다듬을 수 있는 기회" />,
      content: (
        <>
          지식을 공유하고 전달하는 과정에서 자신이 아는 것을 확고히 할 수
          있어요.
          <br /> 멘토링을 통해 전문성을 향상시켜 보세요!
        </>
      ),
    },
    {
      title: '경력 개발과 리더십 향상',
      img: <Image src={IcNetwork} alt="경력 개발과 리더십 향상" />,
      content: (
        <>
          멘토링 경험은 향후 팀 리더나 관리자 역할에 필요한 리더십 스킬 향상에
          도움이 되요
          <br />
          이력서에 멘토링 경험을 추가하여 커리어 경쟁력 강화해보시는건 어떨까요?
        </>
      ),
    },
  ];
  const onRouter = useCallback(() => {
    if (!data) {
      return router.push('/login');
    }
    router.push('/mentor/info');
  }, [data, router]);
  return (
    <>
      <article className={style.article01}>
        <div className={style.textbox}>
          <h4>
            지식 공유의 새로운 길,
            <br /> 1:1 맞춤 멘토링을 시작하세요
          </h4>
          <p>
            시니어부터 주니어까지, 모든 경험은 값진 지식이 됩니다,
            <br /> 나만의 노하우를 공유하며 함께 성장하는 멘토링을 시작해보세요
          </p>
          <button onClick={() => onRouter()}>멘토 지원하기</button>
        </div>
        <IcMentorbg />
      </article>
      <article className={style.article02}>
        <h4>
          <span>지금 시작해야 하는 이유</span>이런 점이 좋아요!
        </h4>
        <ul className={style.reasons}>
          {reason.map((reasons, i) => (
            <li key={i}>
              {reasons.img}
              <em>{reasons.title}</em>
              <p>{reasons.content}</p>
            </li>
          ))}
        </ul>
      </article>
      <article className={style.article03}>
        <h4>자주 묻는 질문</h4>
        <FaqItem faq={faq} />
      </article>
    </>
  );
}
