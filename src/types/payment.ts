export interface PaymentMentorItem {
  id: string;
  price: number;
  menteeName: string;
  createdAt: string;
  programTitle: string;
}
export interface PaymentMentor {
  totalPage: number;
  totalIncome: string;
  monthlyIncome: string;
  message: string;
  items: PaymentMentorItem[];
}

export interface PaymentMenteeItem {
  id: string;
  price: number;
  receiptUrl: string;
  orderId: string;
  status: string;
  mentorName: string;
  programTitle: string;
  createdAt: string;
  paymentKey: string;
}
export interface PaymentMentee {
  totalPage: number;
  message: string;
  items: PaymentMenteeItem[];
}
