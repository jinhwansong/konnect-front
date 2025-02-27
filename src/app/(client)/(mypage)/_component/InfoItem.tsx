import React from 'react';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import style from './infoItem.module.scss';
import { IInfoItem } from '@/type';

export default function InfoItem({
  label,
  data,
  isEditing,
  handleEdit,
  handleSave,
  type,
  placeholder,
  handleCancel,
  error,
  onChange,
  checkPasswordLabel,
  checkPasswordData,
  checkPasswordOnChange,
  checkPasswordPlaceholder,
  checkPasswordError,
  newPasswordLabel,
  newPasswordData,
  newPasswordOnChange,
  newPasswordPlaceholder,
  newPasswordError,
  sns,
}: IInfoItem) {
  const canEdit = label !== '이메일' && label !== '이름' && !sns && !isEditing;
  return (
    <div className={style.info_item}>
      <em className={isEditing ? style.item_title_on : style.item_title}>
        {label}
      </em>
      <div className={isEditing ? style.item_on : style.item_right}>
        {isEditing ? (
          <>
            <Input
              type={type as string}
              name={label}
              onChange={onChange}
              placeholder={placeholder}
              value={data}
            />
            <p className={style.error}>{error}</p>
            {label === '비밀번호' && (
              <>
                <Input
                  type={type as string}
                  name={newPasswordLabel as string}
                  onChange={newPasswordOnChange}
                  placeholder={newPasswordPlaceholder}
                  value={newPasswordData}
                />
                <p className={style.error}>{newPasswordError}</p>
                <Input
                  type={type as string}
                  name={checkPasswordLabel as string}
                  onChange={checkPasswordOnChange}
                  placeholder={checkPasswordPlaceholder}
                  value={checkPasswordData}
                />
                <p className={style.error}>{checkPasswordError}</p>
              </>
            )}
            <div className={style.button_wrap}>
              <Button
                type="button"
                onClick={handleCancel}
                bg="none"
                width="Small"
              >
                취소
              </Button>
              <Button type="button" onClick={handleSave} width="Small">
                변경
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className={data ? style.item_text : style.no_text}>
              {label === '비밀번호' ? sns : data ? data : placeholder}
            </p>

            {canEdit && (
              <Button
                type="button"
                bg="border"
                onClick={handleEdit}
                width="Small"
              >
                설정
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
