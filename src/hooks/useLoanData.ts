import { useState, useEffect } from 'react';
import { Loan, Payment } from '@/types/loan';
import { calculatePaymentSchedule, calculatePenalty } from '@/utils/loanCalculations';

export const useLoanData = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedLoans = localStorage.getItem('loans');
    const savedPayments = localStorage.getItem('payments');
    
    if (savedLoans) setLoans(JSON.parse(savedLoans));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
  }, []);

  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  const createLoan = (loanData: any) => {
    const totalInterest = (loanData.amountBorrowed * loanData.interestRate) / 100;
    const totalAmount = loanData.amountBorrowed + totalInterest;
    
    const schedule = calculatePaymentSchedule(
      loanData.amountBorrowed,
      loanData.interestRate,
      loanData.paymentFrequency,
      loanData.termLength,
      loanData.startDate
    );

    const endDate = schedule[schedule.length - 1].dueDate;
    
    const newLoan: Loan = {
      id: Date.now().toString(),
      customerId: Date.now().toString(),
      customerName: loanData.customerName,
      dateRecorded: new Date().toISOString().split('T')[0],
      amountBorrowed: loanData.amountBorrowed,
      interestRate: loanData.interestRate,
      paymentFrequency: loanData.paymentFrequency,
      termLength: loanData.termLength,
      startDate: loanData.startDate,
      endDate,
      status: 'active',
      totalAmount,
      remainingBalance: totalAmount,
      penaltyRate: loanData.penaltyRate,
      agreementPhoto: loanData.agreementPhoto,
      notes: loanData.notes
    };

    const newPayments: Payment[] = schedule.map((item, index) => ({
      id: `${newLoan.id}-${index + 1}`,
      loanId: newLoan.id,
      paymentNumber: item.paymentNumber,
      dueDate: item.dueDate,
      amountDue: item.totalAmount,
      amountPaid: 0,
      isPaid: false,
      isOverdue: new Date(item.dueDate) < new Date(),
      penalty: 0
    }));

    setLoans(prev => [...prev, newLoan]);
    setPayments(prev => [...prev, ...newPayments]);
    
    return newLoan.id;
  };

  const recordPayment = (paymentData: Partial<Payment>) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentData.id ? { ...p, ...paymentData } : p
    ));

    const loan = loans.find(l => l.id === paymentData.loanId);
    if (loan && paymentData.amountPaid) {
      const updatedBalance = loan.remainingBalance - paymentData.amountPaid;
      const allPaid = payments.filter(p => p.loanId === loan.id).every(p => 
        p.id === paymentData.id ? true : p.isPaid
      );

      setLoans(prev => prev.map(l => 
        l.id === loan.id ? {
          ...l,
          remainingBalance: Math.max(0, updatedBalance),
          status: allPaid ? 'completed' : l.status
        } : l
      ));
    }
  };

  const getLoanPayments = (loanId: string) => {
    return payments.filter(p => p.loanId === loanId);
  };

  return {
    loans,
    payments,
    createLoan,
    recordPayment,
    getLoanPayments
  };
};
