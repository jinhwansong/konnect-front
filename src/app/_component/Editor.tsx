'use client'
import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Toolbar from './Toolbar';
import { useToastStore } from '@/store/useToastStore';
import style from './toolbar.module.scss';

interface IEditor {
  onIntroduce:(newContent: string) => void;
  introduce: string;
}

export default function Editor({ introduce, onIntroduce }: IEditor) {
  // toast팝업
    const { showToast } = useToastStore((state) => state);
  // 이미지핸들러
  const handleImageUpload = useCallback(
    async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images[]', file);
      });

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
        },
      }),
    ],
    content: introduce,
    onUpdate: ({ editor }) => {
      onIntroduce(editor.getHTML());
    },
    editorProps: {
      handleDrop: (view, e, slice, moved) => {
        if (!moved && e.dataTransfer?.files.length) {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files).filter((file)=>{
            file.type.startsWith('image/')
          })
          if (files.length) {
            handleImageUpload(files).then((urls) => {
              if (urls) {
                const { tr } = view.state;
                const pos = view.posAtCoords({
                  left: e.clientX,
                  top: e.clientY,
                })?.pos;
                if(pos){
                  urls.forEach((url:string, i:number)=>{
                    view.dispatch(tr.insert(pos +i, view.state.schema.nodes.image.create({src:url})))
                  })
                }
              }
            });
            return true
          }
          
        }
        return false;
      },
    },
  });

  if (!editor) return null;
  return (
    <div className={style.editor_wrap}>
      <Toolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}
