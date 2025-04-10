'use client';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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
  const [error, setError] = useState('')
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
  
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (data.code === 401) {
        setError('아이디 또는 비밀번호가 일치하지 않습니다');
      }
      if (data) {
        queryclient.setQueryData(['mydata'], data);
        router.replace('/');
      }
    },
    [email, password, queryclient, router]
  );
  return (
    <article className={style.article}>
      <h4 className={style.title}>커넥트 시작하기</h4>
      <form onSubmit={onSubmit} className={style.form}>
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
        <p>{error}</p>

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
