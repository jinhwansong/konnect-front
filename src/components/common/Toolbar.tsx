'use client';
import { Editor } from '@tiptap/react';
import React, { useRef, useState } from 'react';
import {
  MdCode,
  MdFormatBold,
  MdFormatColorText,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdHorizontalRule,
  MdImage,
  MdTerminal,
} from 'react-icons/md';

import useClickOutside from '@/hooks/useClickOutside';

interface IToolbar {
  editor: Editor;
  onImageUpload: (files: File[]) => Promise<string[]>;
}

const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF6B6B', // Red
  '#E03131', // Crimson
  '#F59F00', // Amber
  '#FAB005', // Yellow
  '#40C057', // Green
  '#2F9E44', // Dark Green
  '#22B8CF', // Cyan
  '#0C8599', // Dark Cyan
  '#339AF0', // Blue
  '#1971C2', // Dark Blue
  '#845EF7', // Violet
  '#5F3DC4', // Indigo
  '#D6336C', // Pink
  '#AE3EC9', // Purple
  '#F783AC', // Light Pink
  '#FCC419', // Light Orange
  '#868E96', // Gray
  '#495057', // Dark Gray
];
export default function Toolbar({ editor, onImageUpload }: IToolbar) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  useClickOutside(colorRef, () => setShowColorPicker(false));

  // 이미지 인풋
  const imageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      const urls = await onImageUpload(files);
      urls.forEach(url => {
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      });
    }
  };
  const baseBtn =
    'cursor-pointer w-10 h-10 flex items-center justify-center rounded-md text-sm transition hover:bg-[var(--primary-sub02)] hover:text-[var(--text-bold)]';

  const activeBtn = 'bg-[var(--primary)] text-white';

  return (
    <div className="relative flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] p-2.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${baseBtn} ${editor.isActive('bold') ? activeBtn : ''}`}
        >
          <MdFormatBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${baseBtn} ${editor.isActive('italic') ? activeBtn : ''}`}
        >
          <MdFormatItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${baseBtn} ${editor.isActive('strike') ? activeBtn : ''}`}
        >
          <MdFormatStrikethrough />
        </button>

        <div className="relative" ref={colorRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(prev => !prev)}
            className={`${baseBtn} ${editor.isActive('textStyle') ? activeBtn : ''}`}
          >
            <MdFormatColorText />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 z-50 mt-2 grid w-56 grid-cols-5 gap-1 rounded-md border border-[var(--border-color)] bg-[var(--background)] p-2 shadow-lg">
              {COLORS.map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className={`h-8 w-8 rounded border ${
                    editor.isActive('textStyle', { color })
                      ? 'ring-2 ring-[var(--primary-sub01)]'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-1 h-6 w-px bg-[var(--border-color)]" />

      {/* Code & Block */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${baseBtn} ${editor.isActive('code') ? activeBtn : ''}`}
        >
          <MdCode />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${baseBtn} ${editor.isActive('codeBlock') ? activeBtn : ''}`}
        >
          <MdTerminal />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${baseBtn} ${editor.isActive('blockquote') ? activeBtn : ''}`}
        >
          <MdFormatQuote />
        </button>
      </div>

      <div className="mx-1 h-6 w-px bg-[var(--border-color)]" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${baseBtn} ${editor.isActive('bulletList') ? activeBtn : ''}`}
        >
          <MdFormatListBulleted />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${baseBtn} ${editor.isActive('orderedList') ? activeBtn : ''}`}
        >
          <MdFormatListNumbered />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={baseBtn}
        >
          <MdHorizontalRule />
        </button>
        <label className={baseBtn}>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={imageInput}
          />
          <MdImage />
        </label>
      </div>
    </div>
  );
}
