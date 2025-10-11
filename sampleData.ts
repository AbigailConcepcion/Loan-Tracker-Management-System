import { Loan, Payment } from '@/types/loan';

export const sampleLoans: Loan[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Maria Santos',
    dateRecorded: '2025-01-01',
    amountBorrowed: 10000,
    interestRate: 15,
    paymentFrequency: 'monthly',
    termLength: 6,
    startDate: '2025-01-01',
    endDate: '2025-07-01',
    status: 'active',
    totalAmount: 11500,
    remainingBalance: 7666.67,
    penaltyRate: 2,
    notes: 'Personal loan for business capital'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Juan Dela Cruz',
    dateRecorded: '2025-02-01',
    amountBorrowed: 5000,
    interestRate: 20,
    paymentFrequency: 'weekly',
    termLength: 8,
    startDate: '2025-02-01',
    endDate: '2025-03-29',
    status: 'active',
    totalAmount: 6000,
    remainingBalance: 4500,
    penaltyRate: 3,
    notes: 'Emergency loan'
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Ana Reyes',
    dateRecorded: '2024-12-01',
    amountBorrowed: 15000,
    interestRate: 10,
    paymentFrequency: 'bi-monthly',
    termLength: 12,
    startDate: '2024-12-01',
    endDate: '2025-06-01',
    status: 'active',
    totalAmount: 16500,
    remainingBalance: 11000,
    penaltyRate: 1.5
  }
];

export const samplePayments: Payment[] = [
  {
    id: '1-1',
    loanId: '1',
    paymentNumber: 1,
    dueDate: '2025-02-01',
    amountDue: 1916.67,
    amountPaid: 1916.67,
    isPaid: true,
    isOverdue: false,
    penalty: 0,
    paidDate: '2025-02-01'
  },
  {
    id: '1-2',
    loanId: '1',
    paymentNumber: 2,
    dueDate: '2025-03-01',
    amountDue: 1916.67,
    amountPaid: 1916.67,
    isPaid: true,
    isOverdue: false,
    penalty: 0,
    paidDate: '2025-03-01'
  },
  {
    id: '1-3',
    loanId: '1',
    paymentNumber: 3,
    dueDate: '2025-04-01',
    amountDue: 1916.67,
    amountPaid: 0,
    isPaid: false,
    isOverdue: false,
    penalty: 0
  }
];
