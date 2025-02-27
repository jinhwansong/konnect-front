import React from 'react'
import style from './input.module.scss';

interface Input {
  type: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bg?: string;
  name: string;
  maxLength?: number;
  height?: string;
  flex?:string;
}

export default function Input({
  value,
  type,
  placeholder,
  onChange,
  bg,
  name,
  maxLength,
  height,
  flex,
}: Input) {
  const input = [
    style.input,
    bg && style[`bg${bg as string}`],
    height && style[`height${height as string}`],
    flex && style[`flex${flex as string}`],
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <input
      id={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={input}
      name={name}
      maxLength={maxLength}
    />
  );
}
