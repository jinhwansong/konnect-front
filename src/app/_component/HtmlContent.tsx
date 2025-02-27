'use client';
import React from 'react';
import style from './html.module.scss';
import DOMPurify from 'dompurify';

interface INoSSRContentProps {
  html: string;
}

export default function HtmlContent({ html }: INoSSRContentProps) {
  const cleanContent = DOMPurify.sanitize(html);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: cleanContent }}
      className={style.html}
    />
  );
}
