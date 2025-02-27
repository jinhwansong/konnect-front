import dynamic from 'next/dynamic';
import React from 'react'

const NoSSRContent = dynamic(() => import('@/app/_component/HtmlContent'), {
  ssr: false,
});

interface IHtmlWrapper {
    html: string;
 
}

export default function HtmlWrapper({ html }: IHtmlWrapper) {
  return <NoSSRContent html={html} />;
}
