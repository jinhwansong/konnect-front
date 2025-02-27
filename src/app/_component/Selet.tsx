'use client';
import React from 'react';
import { BiCaretDown, BiCaretUp } from 'react-icons/bi';
import usePopup from '@/hooks/usePopup';
import style from './selet.module.scss';
import Button from './Button';

interface ISelet {
  list: string[];
  seletText: string;
  open: boolean;
  onPopup: () => void;
  text: string;
  onSelet: (selet: string) => void;
  width?: string;
  changeData?: (value: string) => Promise<void>;
}
export default function Selet({
  onPopup,
  seletText,
  open,
  list,
  text,
  onSelet,
  width,
  changeData,
}: ISelet) {
  const { popupRef } = usePopup();
  const seletbox = [style.seletbox, width && style[`width${width as string}`]]
    .filter(Boolean)
    .join(' ');
  const selet_botton = [
    style.selet_botton,
    width && style[`width${width as string}`],
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={selet_botton}>
      <button
        onClick={onPopup}
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <p>
          {text === '전체' ? '직무 카테고리' : ''}
          <span className={text === '전체' ? style.red : ''}>
            {seletText ? seletText : text}
          </span>
        </p>
        {open ? <BiCaretUp /> : <BiCaretDown />}
      </button>
      {open && (
        <div ref={popupRef} className={seletbox}>
          {list.map((jobs) => (
            <button
              type="button"
              key={jobs}
              onClick={() => onSelet(jobs)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {jobs}
            </button>
          ))}
          {text === '전체' && (
            <div className={style.button_wrap}>
              <Button onClick={onPopup} type="button" bg="none" width="Small">
                취소
              </Button>
              <Button
                onClick={() => changeData?.(seletText)}
                type="button"
                width="Small"
              >
                적용하기
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
