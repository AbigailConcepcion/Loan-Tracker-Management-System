import { PaymentFrequency, PaymentScheduleItem } from '@/types/loan';

export const calculatePaymentSchedule = (
  principal: number,
  interestRate: number,
  frequency: PaymentFrequency,
  termLength: number,
  startDate: string
): PaymentScheduleItem[] => {
  const schedule: PaymentScheduleItem[] = [];
  let balance = principal;
  const totalInterest = (principal * interestRate) / 100;
  const totalAmount = principal + totalInterest;
  const paymentAmount = totalAmount / termLength;
  const interestPerPayment = totalInterest / termLength;
  const principalPerPayment = principal / termLength;

  const start = new Date(startDate);
  
  for (let i = 1; i <= termLength; i++) {
    const dueDate = new Date(start);
    
    switch (frequency) {
      case 'daily':
        dueDate.setDate(start.getDate() + i);
        break;
      case 'weekly':
        dueDate.setDate(start.getDate() + (i * 7));
        break;
      case 'bi-monthly':
        dueDate.setDate(start.getDate() + (i * 15));
        break;
      case 'monthly':
        dueDate.setMonth(start.getMonth() + i);
        break;
    }

    balance -= principalPerPayment;
    
    schedule.push({
      paymentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      principal: principalPerPayment,
      interest: interestPerPayment,
      totalAmount: paymentAmount,
      balance: Math.max(0, balance)
    });
  }
  
  return schedule;
};

export const calculatePenalty = (
  amountDue: number,
  penaltyRate: number,
  daysOverdue: number
): number => {
  return (amountDue * penaltyRate / 100) * daysOverdue;
};
