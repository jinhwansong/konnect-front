'use client'
import React, { useCallback, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useDropzone } from 'react-dropzone';
import Toolbar from './Toolbar';
import { useToastStore } from '@/store/useToastStore';
import style from './toolbar.module.scss';

interface IEditor {
  onIntroduce:(newContent: string) => void;
  introduce: string;
}

export default function Editor({ introduce, onIntroduce }: IEditor) {
  const [isDropActive, setIsDropActive] = useState(false);
  // toast팝업
    const { showToast } = useToastStore((state) => state);
  // 이미지핸들러
  const handleImageUpload = useCallback(
    async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        if (file.name.length > 30) {
          return showToast('파일명은 글자수 30미만으로 적어주세요.', 'error');
        }
        if (file.size > 5 * 1024 * 1024) {
          return showToast('파일크기는 5mb 미만으로 줄여주세요.', 'error');
        }
        formData.append('images[]', file);
      });
      formData.append('optimize', 'true');
      formData.append('maxWidth', '800');
      formData.append('quality', '80');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mentor/images`,{
            method: 'POST',
            credentials: 'include',
            body: formData,
          }
        );
        const data = await res.json();
        return data.url.map(
          (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`
        );
      } catch (error: any) {
        showToast(error.data, 'error');
        return [];
      }
    },
    [showToast]
  );
  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
          loading: 'lazy',
          decoding: 'async',
        },
        allowBase64: false,
      }),
    ],
    content: introduce,
    onUpdate: ({ editor }) => {
      onIntroduce(editor.getHTML());
    },
  });
  // 드롭존에 이미지 삽입 함수
  const insertImages = useCallback(
    (urls: string[]) => {
      if (!editor || !urls.length) return;
      urls.forEach((url) =>
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt: '이미지', title: '업로드된 이미지' })
          .run()
      );
    },
    [editor]
  );
  // 드롭존 설정
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    noClick: true,
    noKeyboard: true,
    onDrop: async (acceptedFiles) => {
      if (!editor) return null;
      try {
        const urls = await handleImageUpload(acceptedFiles);
        insertImages(urls);
      } catch (error) {
        console.error('File upload failed:', error);
      } finally {
        setIsDropActive(false);
      }
    },
    onDragEnter: () => setIsDropActive(true),
    onDragLeave: () => setIsDropActive(false),
  });
  // 드롭존으로 인한 이미지 버튼 클릭 핸들러 다시...
  const handleToolbarImageUpload = useCallback(
    async (files: File[]) => {
      const urls = await handleImageUpload(files);
      insertImages(urls);
      return urls;
    },
    [handleImageUpload, insertImages]
  );
  if (!editor) return null;
  return (
    <div
      className={`${style.editor_wrap} ${
        isDropActive ? style.dropzone_active : ''
      }`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {isDropActive && (
        <div className={style.dropzone_overlay}>
          <p>이미지를 여기에 놓으세요</p>
        </div>
      )}
      <Toolbar editor={editor} onImageUpload={handleToolbarImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}
