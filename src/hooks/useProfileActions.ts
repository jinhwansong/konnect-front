import React, { useCallback, useState } from 'react';
import { useToastStore } from '@/store/useToastStore';
import { usePopupStore } from '@/store/usePopupStore';
import { useQueryClient } from '@tanstack/react-query';
import { IErr } from '@/type';

type ISave = string | number | { newPassword: string; currentPassword: string };
type KeyType =
  | '회사명'
  | '닉네임'
  | '휴대폰 번호'
  | '멘토 연차'
  | '자기소개'
  | '전문분야'
type AllKeyType = KeyType | '비밀번호';
const keyMapping: Record<KeyType, string> = {
  '회사명': 'company',
  '닉네임': 'nickname',
  '휴대폰 번호': 'phone',
  '멘토 연차': 'career',
  '자기소개': 'introduce',
  '전문분야': 'position',
};
export default function useProfileActions() {
  // 캐시 무효화
  const queryClient = useQueryClient();
  // toast팝업
  const { showToast } = useToastStore((state) => state);
  // 팝업 닫기
  const { closePop } = usePopupStore();
  // 버튼
  const [prevKey, setPrevKey] = useState<string | null>('');
  const handleEdit = useCallback((name: string) => {
    setPrevKey((prev) => (prev === name ? null : name));
  }, []);
  // 취소
  const handleCancel = useCallback(
    (
      change: (
        e:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLTextAreaElement>
      ) => void,
      data: string
    ) => {
      const chageEvent = (value: string) =>
        ({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
      change(chageEvent(data));
      showToast('변경이 취소되었습니다.', 'error');
      setPrevKey(null);
    },
    [showToast]
  );
  const handleCancelCareer = useCallback(
    (change: (newValue: string) => void, data: string) => {
      change(data);
      showToast('변경이 취소되었습니다.', 'error');
      setPrevKey(null);
      closePop();
    },
    [showToast, closePop]
  );
  
  // 변경
  const handleSave = useCallback(
    (name: AllKeyType, data: ISave, mutation: any) => {
      mutation.mutate(data, {
        onSuccess: (res: any) => {
          showToast(res.message, 'success');
          setPrevKey(null);
          queryClient.invalidateQueries({ queryKey: ['mydata'] });
          if (name in keyMapping) {
            const responseKey = keyMapping[name as KeyType];
            if (responseKey && res[responseKey]) {
              queryClient.setQueryData(['mydata'], (old: any) => {
                const newData = {
                  ...old,
                  [responseKey]: res[responseKey],
                };
                return newData;
              });
              queryClient.setQueryData(['mentordata'], (old: any) => {
                const newData = {
                  ...old,
                  [responseKey]: res[responseKey],
                };
                return newData;
              });
            }
          } 
          queryClient.invalidateQueries({ queryKey: ['mentordata'] });
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      });
    },
    [queryClient, showToast]
  );

  return { prevKey, handleEdit, handleCancel, handleSave, handleCancelCareer };
}
