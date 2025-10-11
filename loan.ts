export type PaymentFrequency = 'daily' | 'weekly' | 'bi-monthly' | 'monthly';
export type LoanStatus = 'active' | 'completed' | 'overdue';

export interface Customer {
  id: string;
  name: string;
  idPhoto?: string;
  pin?: string;
  contactNumber?: string;
}

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  dateRecorded: string;
  amountBorrowed: number;
  interestRate: number;
  paymentFrequency: PaymentFrequency;
  termLength: number;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  totalAmount: number;
  remainingBalance: number;
  penaltyRate?: number;
  agreementPhoto?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  paymentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  paidDate?: string;
  isPaid: boolean;
  isOverdue: boolean;
  penalty: number;
  receiptPhoto?: string;
  notes?: string;
}

export interface PaymentScheduleItem {
  paymentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalAmount: number;
  balance: number;
}
