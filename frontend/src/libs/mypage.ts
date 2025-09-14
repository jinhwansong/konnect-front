import {
  CareerRequest,
  CompanyHiddenRequest,
  CompanyRequest,
  ExpertiseRequest,
  MentorProfileResponse,
  MessageResponse,
  NicknameRequest,
  PasswordRequest,
  PhoneRequest,
  PositionRequest,
} from '@/types/user';

import { fetcher } from '@/utils/fetcher';

export const patchNickname = async (data: NicknameRequest) => {
  return fetcher<NicknameRequest>(`user/nickname`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const patchPhone = async (data: PhoneRequest) => {
  return fetcher<PhoneRequest>(`user/phone`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const patchPassword = async (data: PasswordRequest) => {
  return fetcher<MessageResponse>(`user/password`, {
    method: 'PATCH',
    body: JSON.stringify({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
    }),
  });
};

export const uploadProfileImage = (
  formData: FormData,
): Promise<{ image: string }> => {
  return fetcher<{ image: string }>('user/profile', {
    method: 'PATCH',
    body: formData,
  });
};

export const deleteProfile = async () => {
  return fetcher<MessageResponse>(`user/me`, {
    method: 'Delete',
  });
};

export const patchIsCompanyHidden = async (data: CompanyHiddenRequest) => {
  return fetcher<CompanyHiddenRequest>(`mentor/company-name`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
export const patchCompany = async (data: CompanyRequest) => {
  return fetcher<CompanyRequest>(`mentor/company`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
export const patchPosition = async (data: PositionRequest) => {
  return fetcher<PositionRequest>(`mentor/position `, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
export const patchCareer = async (data: CareerRequest) => {
  return fetcher<CareerRequest>(`mentor/career`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
export const patchExpertise = async (data: ExpertiseRequest) => {
  return fetcher<ExpertiseRequest>(`mentor/expertise`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const getMentorProfile = async () => {
  return fetcher<MentorProfileResponse>(`mentor`, {
    method: 'GET',
  });
};
