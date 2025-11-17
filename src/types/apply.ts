export interface ApplyRequest {
  company: string;
  introduce: string;
  position: string;
  career: string;
  expertise: string[];
  portfolio: string;
}

export interface Option<T = string> {
  label: string;
  value: T;
}
