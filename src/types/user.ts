export interface UserResponse {
  message: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  image: string;
  role: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupFormData extends UserRegistrationRequest {
  passwordConfirm: string;
  code: string;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
}

export interface MessageResponse {
  message: string;
}

export interface SendEmailVerificationRequest {
  email: string;
}
export interface VerifyEmailCodeRequest extends SendEmailVerificationRequest {
  code: string;
}

export interface NicknameRequest {
  nickname: string;
}
export interface PhoneRequest {
  phone: string;
}
export interface PasswordRequest {
  currentPassword: string;
  newPassword: string;
}
export interface PasswordFormValues extends PasswordRequest {
  confirmPassword: string;
}

export interface CompanyHiddenRequest {
  isCompanyHidden: boolean;
}
export interface CareerRequest {
  career: string;
}
export interface ExpertiseRequest {
  expertise: string[];
}
export interface PositionRequest {
  position: string;
}
export interface CompanyRequest {
  company: string;
}

export interface MentorProfileResponse {
  message: string;
  career: string;
  company: string;
  expertise: string[];
  isCompanyHidden: boolean;
  position: string;
}
