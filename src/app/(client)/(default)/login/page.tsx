'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { onSubmit } from '@/app/_lib/useLogin';
import Button from '@/app/_component/Button';
import Input from '@/app/_component/Input';
import Social from '@/app/(client)/_component/Social';
import useInput from '@/hooks/useInput';
import style from './login.module.scss';

export default function Login() {
  const router = useRouter();
  const queryclient = useQueryClient();
  const [email, changeEmail] = useInput('');
  const [password, changePassword] = useInput('');
  const input = [
    {
      type: 'text',
      name: 'email',
      value: email,
      onChange: changeEmail,
      placeholder: '이메일',
    },
    {
      type: 'password',
      name: 'password',
      value: password,
      onChange: changePassword,
      placeholder: '비밀번호',
    },
  ];
  const [state, formAction] = useFormState(onSubmit, { message: null });
  if (state?.ok) {
    queryclient.setQueryData(['mydata'], state.data);
    router.replace('/');
  }
  return (
    <article className={style.article}>
      <h4 className={style.title}>커넥트 시작하기</h4>
      <form action={formAction} className={style.form}>
        {input.map((inputs, i) => (
          <Input
            type={inputs.type}
            placeholder={inputs.placeholder}
            name={inputs.name}
            onChange={inputs.onChange}
            value={inputs.value}
            key={i}
          />
        ))}
        <p>{state?.message as string}</p>

        <Button type="submit">로그인</Button>
      </form>
      <div className={style.signup}>
        <Link href="/password">아이디 찾기</Link>
        <Link href="/password">비밀번호 찾기</Link>
        <Link href="/signup/terms">회원가입</Link>
      </div>
      <Social text="로그인" />
    </article>
  );
}
