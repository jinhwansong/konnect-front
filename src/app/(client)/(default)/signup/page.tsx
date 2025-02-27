'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useCheckboxStore } from '@/store/useCheck';
import useVaild from '@/hooks/useVaild';
import {
  onEmail,
  onPassword,
  onPasswordcheck,
  onName,
  onPhone,
} from '@/util/useSign';
import { onSubmit } from '@/app/_lib/useSignup';
import Button from '@/app/_component/Button';
import Input from '@/app/_component/Input';
import Social from '@/app/(client)/_component/Social';
import style from './signup.module.scss';
import { useCheckEmail, useCheckNickname } from '@/app/_lib/useEtc';

export default function SignUp() {
  const router = useRouter();
  const { checks } = useCheckboxStore();
  useEffect(() => {
    if (checks) {
      router.replace('/signup/terms');
    }
  }, [checks, router]);
  const [email, changeEmail, emailError, emailvaild, setEmailVaild] = useVaild(
    '',
    onEmail
  );
  const [checkEmail, setCheckEmail] = useState({
    isValid: false,
    message: '',
  });
  const [password, changePassword, passwordError] = useVaild('', onPassword);
  const [passwordcheck, changePasswordcheck, passwordcheckError] = useVaild(
    '',
    (value) => onPasswordcheck(password, value)
  );
  const [name, changeName, nameError] = useVaild('', onName);
  const [
    nickname,
    changeNickname,
    nicknameError,
    nicknamevaild,
    setNicknameVaild,
  ] = useVaild('', onName);
  const [checkNickname, setCheckNickname] = useState({
    isValid: false,
    message: '',
  });
  const [phone, changePhone, phoneError] = useVaild('', onPhone);
  // 데이터 보내기
  const [state, formAction] = useFormState(onSubmit, { message: null });
  const sign = [
    {
      type: 'text',
      value: email,
      onChange: changeEmail,
      label: '이메일',
      name: 'email',
      placeholder: 'example@konnect.com',
      error: emailError,
    },
    {
      type: 'password',
      value: password,
      onChange: changePassword,
      label: '비밀번호',
      name: 'password',
      placeholder: '8자이상 영문 숫자 특수문자 포함',
      error: passwordError,
    },
    {
      type: 'password',
      value: passwordcheck,
      onChange: changePasswordcheck,
      label: '비밀번호 확인',
      name: 'passwordcheck',
      placeholder: '8자이상 영문 숫자 특수문자 포함',
      error: passwordcheckError,
    },
    {
      type: 'text',
      value: name,
      onChange: changeName,
      label: '이름',
      name: 'name',
      placeholder: '지젤',
      error: nameError,
    },
    {
      type: 'text',
      value: nickname,
      onChange: changeNickname,
      label: '닉네임',
      name: 'nickname',
      placeholder: '지젤',
      error: nicknameError,
    },
    {
      type: 'number',
      value: phone,
      onChange: changePhone,
      label: '휴대폰 번호',
      name: 'phone',
      placeholder: '-없이 숫자만 입력',
      error: phoneError,
    },
  ];
  // 중복이메일
  const checkEmailMutation = useCheckEmail();
  // 중복닉네임
  const checkNicknameMutation = useCheckNickname();
  const onDuplication = useCallback(
    (name: string) => {
      const mutation =
        name === 'email' ? checkEmailMutation : checkNicknameMutation;
      const value = name === 'email' ? email : nickname;
      const check = name === 'email' ? setCheckEmail : setCheckNickname;
      const setVaild = name === 'email' ? setEmailVaild : setNicknameVaild;
      // 중복체크
      mutation.mutate(value, {
        onSuccess: (data) => {
          check({ isValid: true, message: data.message });
          setVaild(true);
        },
        onError: (err: unknown) => {
          if (typeof err === 'object' || err !== null)
            check({ isValid: false, message: (err as any).data });
          setVaild(false);
        },
      });
    },
    [
      email,
      nickname,
      checkNicknameMutation,
      checkEmailMutation,
      setEmailVaild,
      setNicknameVaild,
    ]
  );
  // 서버에러메시지
  const getErrorMessage = (name: string) => {
    if (
      name === 'email' &&
      checkEmail.message !== '이메일 형식이 올바르지 않습니다.' &&
      !checkEmail.isValid
    ) {
      return checkEmail.message;
    }
    if (
      name === 'nickname' &&
      checkNickname.message !== '2글자 이상 7글자 이하로 작성해주세요' &&
      !checkNickname.isValid
    ) {
      return checkNickname.message;
    }
    return '';
  };
  // 서버성공메시지
  const getSuccessMessage = (name: string) => {
    if (name === 'email' && checkEmail.isValid && emailvaild) {
      return checkEmail.message;
    }
    if (name === 'nickname' && checkNickname.isValid && nicknamevaild) {
      return checkNickname.message;
    }
    return '';
  };
  // 버튼 활성화
  const buttonDisabled = () => {
    const empty = [email, password, passwordcheck, name, nickname, phone].every(
      (l) => l.length > 0
    );
    const err = [
      emailError,
      passwordError,
      passwordcheckError,
      nameError,
      nicknameError,
      phoneError,
    ].every((l) => l === '');
    const vaild =
      checkNickname.isValid &&
      checkEmail.isValid &&
      nicknamevaild &&
      emailvaild;
    return empty && err && vaild;
  };
    return (
      <article className={style.article}>
        <h4>
          거이 다왔어요! <br /> <span>회원정보</span>를 입력해주세요
        </h4>
        <form className={style.form} action={formAction}>
          {sign.map((signs, i) => (
            <div className={style.signfield} key={i}>
              <label>{signs.label}</label>
              <div>
                <Input
                  type={signs.type}
                  value={signs.value}
                  onChange={signs.onChange}
                  name={signs.name}
                  placeholder={signs.placeholder}
                  maxLength={signs.name === 'phone' ? 11 : 100}
                  flex="on"
                />
                {(signs.name === 'email' || signs.name === 'nickname') && (
                  <Button
                    type="button"
                    width="80"
                    onClick={() => onDuplication(signs.name)}
                  >
                    중복확인
                  </Button>
                )}
              </div>
              <div className={style.vaild}>
                <p>{signs.error}</p>
                <p>{getErrorMessage(signs.name)}</p>
                <p className={style.successVaild}>
                  {getSuccessMessage(signs.name)}
                </p>
              </div>
            </div>
          ))}

          <Button type="submit" disabled={!buttonDisabled()}>
            회원가입
          </Button>
        </form>
        <Social text="회원가입" />
      </article>
    );
}
