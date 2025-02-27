export interface IErr extends Error{
  code: number;
  data: string
  seccess: boolean
}
interface IAdmin {
  id: number;
  createdAt: string;
  email: string;
  name: string;
}
export interface IAdminUsers extends IAdmin {
  role: string;
  snsId: string;
  image: string | null;
  phone: string;
  nickname: string;
}

export interface IAdminMentors extends IAdmin {
  image: string | null;
  job: string;
  career: string;
  status: string;
}
interface IProgram {
  title: string;
  price: number;
  duration: number;
}
export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export interface ISchedule {
  [key: string]: ITimeSlot[];
}

export interface ICreateProgram extends IProgram {
  content: string;
  available_schedule: ISchedule;
  mentoring_field: string;
}
export interface IModifyProgram extends ICreateProgram {
  id: number;
  available_schedule: ISchedule;
  mentoring_field: string;
}
export interface IGetProgram extends IProgram {
  id: number;
  status: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}
export type StatusType = 'confirmed' | 'progress' | 'completed' | 'cancelled';

export interface IGetSchedule {
  email: string;
  id: number;
  name: string;
  phone: string;
  startTime: string;
  endTime: string;
  status: StatusType;
  title: string;
}

export interface IColumn<T = IAdminUsers | IAdminMentors| IGetProgram|IGetSchedule> {
  id: number;
  name: string;
  render?: (item: T) => React.ReactNode;
}
export interface ITables<T = IAdminUsers | IAdminMentors | IGetProgram|IGetSchedule> {
  items: T[];
  message: string;
  totalPage: number;
}

export interface IPage {
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPage: (page: number) => void;
}


export interface IMentorApprovalParams {
  approved: boolean;
  reason?: string;
  id: number;
}


export interface IMentorMutation {
  email: string;
  job: string;
  introduce: string;
  portfolio: string;
  career: string;
}
// 마이페이지 
export interface InfoField  {
  label: string;
  data: string | undefined;
  onButton?: () => void;
  onSave?: () => void;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};
interface IBaseField {
  label: string;
  data: string;
  isEditing?: boolean;
  handleEdit?: () => void;  
  handleSave?: () => void;  
  handleCancel?: () => void; 
  
}
export interface IInfoItem extends IBaseField {
  placeholder?: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  checkPasswordLabel?: string;
  checkPasswordData?: string;
  checkPasswordOnChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  checkPasswordPlaceholder?: string;
  checkPasswordError?: string;
  newPasswordLabel?: string;
  newPasswordData?: string;
  newPasswordOnChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  newPasswordPlaceholder?: string;
  newPasswordError?: string;
  sns?:string;
}
export interface ICareerItem extends IBaseField {
  options: string[];
  onSelet: (newValue: string) => void;
  popup: boolean;
  onPopup: () => void;
  seletText:string;
}



export interface IfetchProgram {
  page: number;
  limit: number;
  sort: string;
  mentoring_field: string;
}

export interface IItem {
  id: number;
  title: string;
  mentoring_field: string;
  averageRating: string;
  company: string;
  position: string;
  image: string;
  career: string;
  name: string;
  totalReviews: string;
}
export interface IMentoring {
  items: IItem[];
  message?: string
  totalPage?: number
}



