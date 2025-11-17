'use client';

import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

import Toolbar from './Toolbar';

interface EditorWrapperProps {
  value: string;
  onChange: (html: string) => void;
  onImageUpload: (files: File[]) => Promise<string[]>;
}

export default function Editor({
  value,
  onChange,
  onImageUpload,
}: EditorWrapperProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
          loading: 'lazy',
          decoding: 'async',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-4 outline-none scroll-custom',
      },
    },
    /**
     * 👇 바로 렌더링하지 않도록 설정
     */
    autofocus: false,
    editable: true,
    injectCSS: true,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    /**
     * 👇 여기 중요!
     */
    immediatelyRender: false,
  });

  if (!editor) return null;
  return (
    <div className="rounded-lg border border-[var(--border-color)]">
      <Toolbar editor={editor} onImageUpload={onImageUpload} />
      <div className="scroll-custom overflow-auto">
        <EditorContent editor={editor} className="ProseMirror editor" />
      </div>
    </div>
  );
}
