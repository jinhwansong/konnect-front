"use client";
import { useCheckboxStore } from "@/store/useCheck";
import React, { useCallback, useEffect, useState } from "react";

interface IuseCheck {
  id: string;
  required: string;
  name: string;
  checked: boolean;
}

export default function useCheck(initialvalues: IuseCheck[]) {
  const { onCheck, offCheck } = useCheckboxStore();
  const [checkbox, setCheckbox] = useState(
    initialvalues.map((item) => ({ ...item, checked: false }))
  );
  const singlecheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;
    setCheckbox((prev) => prev.map((item) => item.name === name ? {...item, checked}: item));
  }, []);
  const allcheck = useCallback(() => {
    const allChecks = checkbox.every((item) => item.checked);
    setCheckbox((prev) =>
      prev.map((item) => ({ ...item, checked: !allChecks }))
    );
  }, [checkbox]);
  useEffect(() => {
    const essentialCheck = checkbox
      .filter((items) => items.required === '(필수)')
      .every((item) => item.checked);
    if (essentialCheck) {
      onCheck();
    } else {
      offCheck();
    }
  }, [checkbox, onCheck, offCheck]);
  return [checkbox, singlecheck, allcheck] as const;
}
