import React from 'react';
import { Editor } from '@tiptap/react';
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
import { usePopupStore } from '@/store/usePopupStore';
import usePopup from '@/hooks/usePopup';
import style from './toolbar.module.scss';

interface IToolbar {
  editor: Editor;
  onImageUpload: (files: File[]) => Promise<string[]>;
}
const COLORS = [
  '#000000', // 검정
  '#E03131', // 빨강
  '#2F9E44', // 초록
  '#1971C2', // 파랑
  '#F08C00', // 주황
  '#9C36B5', // 보라
  '#495057', // 회색
];

export default function Toolbar({ editor, onImageUpload }: IToolbar) {
  // 이미지 인풋
  const imageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      const urls = await onImageUpload(files);
      urls.forEach((url) => {
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      });
    }
  };
  const { popupRef } = usePopup();
  const { onPopup2, popup2, closePop } = usePopupStore();
  return (
    <div className={style.toolbar}>
      <div className={style.itemBox}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? style.active : ''}
        >
          <MdFormatBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? style.active : ''}
        >
          <MdFormatItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? style.active : ''}
        >
          <MdFormatStrikethrough />
        </button>
        <div className={style.colorPickerContainer} ref={popupRef}>
          <button
            onClick={onPopup2}
            className={editor.isActive('textStyle') ? style.active : ''}
          >
            <MdFormatColorText />
          </button>

          {popup2 && (
            <div className={style.colorPalette}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    closePop;
                  }}
                  className={
                    editor.isActive('textStyle', { color })
                      ? style.activeColor
                      : ''
                  }
                >
                  <div
                    className={style.colorSwatch}
                    style={{ backgroundColor: color }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={style.line} />
      <div className={style.itemBox}>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? style.active : ''}
        >
          <MdCode />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? style.active : ''}
        >
          <MdTerminal />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? style.active : ''}
        >
          <MdFormatQuote />
        </button>
      </div>
      <div className={style.line} />
      <div className={style.itemBox}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? style.active : ''}
        >
          <MdFormatListBulleted />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? style.active : ''}
        >
          <MdFormatListNumbered />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <MdHorizontalRule />
        </button>
        <label className={style.imageUpload}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={imageInput}
            hidden
          />
          <MdImage />
        </label>
      </div>
    </div>
  );
}
