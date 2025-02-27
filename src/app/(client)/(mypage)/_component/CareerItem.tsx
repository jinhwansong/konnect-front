import React from 'react'
import Button from '@/app/_component/Button';
import Selet from '@/app/_component/Selet';
import { ICareerItem } from '@/type';
import style from './infoItem.module.scss';

export default function CareerItem({
  options,
  onSelet,
  popup,
  onPopup,
  label,
  data,
  isEditing,
  handleEdit,
  handleSave,
  handleCancel,
  seletText,
}: ICareerItem) {
  return (
    <div className={style.info_item}>
      <em className={style.item_title}>{label}</em>
      <div className={isEditing ? style.item_on : style.item_right}>
        {isEditing ? (
          <>
            <Selet
              list={options as string[]}
              open={popup as boolean}
              onPopup={onPopup as () => void}
              seletText={seletText}
              text={data as string}
              onSelet={onSelet as (selet: string) => void}
            />
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
            <p className={style.item_text}>{data}</p>
            <Button
              type="button"
              bg="border"
              onClick={handleEdit}
              width="Small"
            >
              설정
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
