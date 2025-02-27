import React from 'react'
import style from "./checkbox.module.scss";

interface ICheckbox {
  id: string;
  weight?: string;
  children: string;
  required?: string;
  checked: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
  id,
  weight,
  children,
  onChange,
  checked,
  name,
  required,
}: ICheckbox) {
  const check = [style.check, weight && style[`weight${weight as string}`]]
    .filter(Boolean)
    .join(' ');
  return (
    <label htmlFor={id} className={check}>
      <input
        type="checkbox"
        id={id}
        className={style.checkbox}
        onChange={onChange}
        checked={checked}
        name={name}
      />
      <em>
        {children} <span>{required}</span>
      </em>
    </label>
  );
}
