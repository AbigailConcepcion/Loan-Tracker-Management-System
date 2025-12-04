import { Loan, Payment, PaymentScheduleItem } from '@/types/loan';

export const computeTotalAmount = (
  principal: number,
  flatInterestRate: number,
) => {
  if (!principal || principal <= 0) return { totalAmount: 0, totalInterest: 0 };
  
  const rateDecimal = (flatInterestRate || 0) / 100;
  const totalInterest = principal * rateDecimal;
  const totalAmount = principal + totalInterest;

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2))
  };
};

export const parseIntervalToDays = (interval: string): number => {
  if (!interval) return 30;
  
  const parts = interval.trim().toLowerCase().split(/\s+/);
  const value = parseInt(parts[0]);
  const unit = parts[1] || '';
  
  if (isNaN(value) || value <= 0) return 30;

  if (!unit || unit.startsWith('day')) return value;
  if (unit.startsWith('week')) return value * 7;
  if (unit.startsWith('month')) return value * 30;
  if (unit.startsWith('year')) return value * 365;
  
  return 30;
};

const mapFrequencyToInterval = (freq: string): string => {
  switch (freq) {
    case 'daily': return '1 day';
    case 'weekly': return '1 week';
    case 'bi-monthly': return '15 days';
    case 'monthly': return '1 month';
    default: return '1 month';
  }
};

export const calculateTotalInterestRate = (
  monthlyRate: number,
  interval: string,
  termLength: number
): number => {
  if (!monthlyRate) return 0;
  
  const intervalDays = parseIntervalToDays(interval);
  const totalDays = intervalDays * termLength;
  const durationInMonths = totalDays / 30;
  
  const totalRate = monthlyRate * durationInMonths;
  return parseFloat(totalRate.toFixed(2));
};

export const calculatePaymentSchedule = (
  loan: Loan
): PaymentScheduleItem[] => {
  const schedule: PaymentScheduleItem[] = [];
  
  const intervalStr = loan.paymentInterval || mapFrequencyToInterval(loan.paymentFrequency);
  const intervalDays = parseIntervalToDays(intervalStr);
  
  const { totalAmount, totalInterest } = computeTotalAmount(loan.amountBorrowed, loan.interestRate);
  
  const terms = loan.termLength || 1;
  const paymentAmount = parseFloat((totalAmount / terms).toFixed(2));
  const interestPerPayment = parseFloat((totalInterest / terms).toFixed(2));
  const principalPerPayment = parseFloat((loan.amountBorrowed / terms).toFixed(2));

  // --- SAFETY CHECK FOR DATE ---
  let currentDue = new Date(loan.startDate);
  if (isNaN(currentDue.getTime())) {
    currentDue = new Date(); // Fallback to today to prevent crash
  }
  currentDue.setHours(0, 0, 0, 0);

  // Advance by one interval for first payment
  currentDue.setDate(currentDue.getDate() + intervalDays);

  let balance = loan.amountBorrowed;

  for (let i = 1; i <= terms; i++) {
    schedule.push({
      paymentNumber: i,
      dueDate: currentDue.toISOString().split('T')[0],
      principal: principalPerPayment,
      interest: interestPerPayment,
      totalAmount: paymentAmount,
      balance: parseFloat(Math.max(0, balance - principalPerPayment).toFixed(2))
    });

    const nextDue = new Date(currentDue);
    nextDue.setDate(nextDue.getDate() + intervalDays);
    currentDue = nextDue;
    currentDue.setHours(0, 0, 0, 0);
    
    balance -= principalPerPayment;
  }

  return schedule;
};

export const calculatePenalty = (
  penaltyRate: number,
  daysOverdue: number
): number => {
  if (!penaltyRate || penaltyRate <= 0 || !daysOverdue || daysOverdue <= 0) return 0;
  return parseFloat((penaltyRate * daysOverdue).toFixed(2));
};

export const getLoanStats = (loan: Loan, allPayments: Payment[]) => {
  const loanPayments = allPayments.filter(p => p.loanId === loan.id && p.isPaid);
  const schedule = calculatePaymentSchedule(loan);
  const today = new Date();
  today.setHours(0,0,0,0);

  let totalPaid = loanPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  let totalPenalties = 0;
  let hasOverdue = false;
  let nextDueDate: string | null = null;

  const computedSchedule = schedule.map(item => {
    const recorded = loanPayments.find(p => p.paymentNumber === item.paymentNumber);
    const due = new Date(item.dueDate);
    due.setHours(0,0,0,0);
    
    const isPaid = !!recorded;
    const isPastDue = !isPaid && due < today;
    const daysOverdue = isPastDue ? Math.floor((today.getTime() - due.getTime()) / (1000*60*60*24)) : 0;
    
    const penalty = calculatePenalty(loan.penaltyRate || loan.penaltyAmount || 0, daysOverdue);
    
    if (isPastDue) {
      hasOverdue = true;
      totalPenalties += penalty;
    }
    
    if (!isPaid && !nextDueDate && due >= today) {
      nextDueDate = item.dueDate;
    }

    return { ...item, isPaid, isPastDue, penalty, daysOverdue };
  });

  if (!nextDueDate && hasOverdue) {
    const firstOverdue = computedSchedule.find(i => i.isPastDue);
    if (firstOverdue) nextDueDate = firstOverdue.dueDate;
  }

  const totalDue = loan.totalAmount + totalPenalties;
  const outstanding = Math.max(0, totalDue - totalPaid);
  
  let status: 'active' | 'overdue' | 'completed' = 'active';
  if (outstanding <= 1) status = 'completed';
  else if (hasOverdue) status = 'overdue';

  return {
    totalPaid,
    totalPenalties,
    outstanding,
    status,
    progress: Math.min(100, (totalPaid / totalDue) * 100),
    nextDueDate,
    schedule: computedSchedule
  };
};
