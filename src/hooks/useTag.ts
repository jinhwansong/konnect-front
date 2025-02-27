'use client'
import React, { useCallback, useState } from 'react'
import useInput from './useInput';

export default function useTag() {
  const [tags, setTags] = useState<string[]>([]);
  const [tag, onTag, setTag] = useInput("");

  /* 태그 지우기 */
  const deleteTag = useCallback(
    (inTag: string) => {
      setTags(tags.filter((v) => v !== inTag));
    },
    [tags]
  );
  /* 태그 */
  const addTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (tags.length >= 3) return alert('태그는 총 3개까지 가능합니다.');
      if (e.key === 'Enter' || (e.key === ',' && !e.nativeEvent.isComposing)) {
        const newTag = tag.split(',')[0];
        if (tags.includes(newTag)) return alert('이미 추가된 태그입니다.');
        setTag('');
        setTags((prev) => [...prev, newTag]);
      }
    },
    [tag, tags, setTag]
  );
  return {
    tags,
    tag,
    addTag,
    deleteTag,
    onTag,
  };
}
