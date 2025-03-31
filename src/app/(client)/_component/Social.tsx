import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { IcGoogle, IcKakao, IcNaver } from "@/asset";
import style from './social.module.scss'

interface ISocial {
  text: string;
}

export default function Social({ text }: ISocial) {
  const router = useRouter();
  const onSocial = useCallback(
    (sns: string) => {
      if (sns === 'kakao') {
        router.push(`https://www.konee.shop/users/auth/kakao`);
      }
      if (sns === 'naver') {
        router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/naver`);
      }
      if (sns === 'google') {
        router.push(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/google`
        );
      }
    },
    [router]
  );
  return (
    <div className={style.social}>
      <hr />
      <span>간편{text}</span>
      <div className={style.social_btn}>
        <button
          type="button"
          onClick={() => onSocial('kakao')}
          className={style.social_kakao}
        >
          <IcKakao />
          카카오로 {text}
        </button>
        <button
          type="button"
          className={style.social_naver}
          onClick={() => onSocial('naver')}
        >
          <IcNaver />
          네이버로 {text}
        </button>
        <button
          type="button"
          className={style.social_google}
          onClick={() => onSocial('google')}
        >
          <IcGoogle />
          구글로 {text}
        </button>
      </div>
    </div>
  );
}
