'use client'
import React, { useCallback, useState } from 'react'
import { BiCaretDown } from 'react-icons/bi';
import style from './faqItem.module.scss';

interface IFaqItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

interface IProps {
  faq: IFaqItem[];
}
export default function FaqItem({ faq }: IProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const onToggle = useCallback((id: number) => {
    setOpenIndex((prev) => (prev === id ? null : id));
  }, []);
  return (
    <>
      {faq.map((faqs) => (
        <button key={faqs.id} onClick={() => onToggle(faqs.id)} className={style.button}>
          <details
            open={openIndex === faqs.id}
            onClick={(e) => e.preventDefault()}
          >
            <summary>
              <span>Q.</span> {faqs.question}
              <BiCaretDown />
            </summary>
            <p>{faqs.answer}</p>
          </details>
        </button>
      ))}
    </>
  );
}
