"use client";
import React, { useState } from "react";

export default function useNumber(initialValue: string) {
  const [number, setNumber] = useState(initialValue);
  const [value, setValue] = useState(Number(initialValue.replace(/\D/g, '')));
  const onNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 문자 제거
    const value = e.target.value.replace(/\D/g, "");
    const unit = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setNumber(unit);
    const numberValue = Number(value);
    setValue(numberValue);
  };
  return [number, onNumber, value] as const;
}
