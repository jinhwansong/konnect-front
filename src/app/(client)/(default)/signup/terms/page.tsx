'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/_component/Button';
import Checkbox from '@/app/_component/Checkbox';
import { check } from '@/app/(client)/config/check';
import { useCheckboxStore } from '@/store/useCheck';
import useCheck from '@/hooks/useCheck';
import style from './terms.module.scss';

export default function TermPage() {
  const [checkbox, singlecheck, allcheck] = useCheck(check);
  const { checks } = useCheckboxStore();
  const router = useRouter();
  const onLink = () => router.push('/signup');
  return (
    <section className={style.section}>
      <h4 className={style.title}>
        <span>이용약관</span>에 먼저
        <br />
        동의해주세요
      </h4>
      <div className={style.allCheck}>
        <Checkbox
          id="allCheck"
          weight="700"
          name="allCheck"
          onChange={allcheck}
          checked={checkbox.every((item) => item.checked)}
        >
          전체동의
        </Checkbox>
      </div>
      <div className={style.checks}>
        {checkbox.map((checkboxs) => (
          <Checkbox
            id={checkboxs.id}
            key={checkboxs.id}
            name={checkboxs.name}
            checked={checkboxs.checked}
            required={checkboxs.required}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              singlecheck(e)
            }
          >
            {checkboxs.name}
          </Checkbox>
        ))}
      </div>
      <p className={style.message}>
        고객은 동의를 거부할 권리가 있으며 동의를 거부할 경우, 사이트 가입 또는
        일부 서비스 이용이 제한됩니다.
      </p>
      <Button type="button" onClick={onLink} disabled={checks}>
        다음단계로
      </Button>
    </section>
  );
}
