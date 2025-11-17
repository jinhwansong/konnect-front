import { useMutation } from '@tanstack/react-query';

import { submitMentorApplication } from '@/libs/mentorApply';
import { ApplyRequest } from '@/types/apply';

export const useMentorApply = () => {
  return useMutation({
    mutationFn: (data: ApplyRequest) => submitMentorApplication(data),
  });
};
