import React, { useState, useEffect } from 'react';
import { Loan } from '@/types/loan';
import { Save, X, Calculator } from 'lucide-react';
import { computeTotalAmount, calculateTotalInterestRate, parseIntervalToDays } from '@/utils/loanCalculations';

interface LoanEditFormProps {
  loan: Loan;
  onSave: (updatedLoan: Loan) => void;
  onCancel: () => void;
}

export const LoanEditForm: React.FC<LoanEditFormProps> = ({ loan, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Loan>(loan);
  // FIX: Use string state
  const [monthlyRate, setMonthlyRate] = useState<string>('0'); 
  
  const [calculation, setCalculation] = useState({
    totalRate: 0,
    durationMonths: 0,
    interestAmount: 0,
    totalRepayment: 0
  });

  useEffect(() => {
    let effectiveInterval = loan.paymentInterval;
    if (!effectiveInterval || !effectiveInterval.includes('day')) {
       if (loan.paymentFrequency === 'bi-monthly') effectiveInterval = '15 days';
       else if (loan.paymentFrequency === 'weekly') effectiveInterval = '7 days';
       else if (loan.paymentFrequency === 'daily') effectiveInterval = '1 day';
       else if (loan.paymentFrequency === 'monthly') effectiveInterval = '30 days';
       else effectiveInterval = '30 days';
    }

    setFormData(prev => ({ ...prev, paymentInterval: effectiveInterval }));

    const intervalDays = parseIntervalToDays(effectiveInterval);
    const totalDays = intervalDays * loan.termLength;
    const months = Math.max(1, totalDays / 30);
    
    // Initialize string state
    setMonthlyRate((loan.interestRate / months).toFixed(1));
  }, []);

  useEffect(() => {
    const principal = formData.amountBorrowed;
    const terms = formData.termLength || 1;
    const interval = formData.paymentInterval || '30 days';

    // Parse string for calculation
    const rateValue = parseFloat(monthlyRate) || 0;
    const calculatedTotalRate = calculateTotalInterestRate(rateValue, interval, terms);
    
    const days = parseIntervalToDays(interval) * terms;
    const durationMonths = parseFloat((days / 30).toFixed(1));

    const { totalAmount, totalInterest } = computeTotalAmount(principal, calculatedTotalRate);

    setCalculation({
      totalRate: calculatedTotalRate,
      durationMonths,
      interestAmount: totalInterest,
      totalRepayment: totalAmount
    });

    setFormData(prev => ({ 
      ...prev, 
      interestRate: calculatedTotalRate,
      totalAmount: totalAmount 
    }));
    
  }, [formData.amountBorrowed, formData.termLength, formData.paymentInterval, monthlyRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termLength || formData.termLength <= 0) {
       alert("Please enter a valid duration.");
       return;
    }
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 flex items-center gap-4 sticky top-0 z-10 shadow-md">
        <button onClick={onCancel} className="p-2 active:scale-95 transition hover:bg-blue-700 rounded-full">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Edit Loan</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Recalculate Terms</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Principal (₱)</label>
              <input
                type="number"
                value={formData.amountBorrowed}
                onChange={e => setFormData({ ...formData, amountBorrowed: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-200 rounded-lg font-bold text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Monthly Interest (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  // FIX: Use string state directly
                  value={monthlyRate} 
                  onChange={e => setMonthlyRate(e.target.value)} 
                  className="w-full p-3 border border-blue-300 bg-blue-50 rounded-lg font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Duration (Payments)</label>
                <input 
                  type="number" 
                  // Allow clearing (0 or empty)
                  value={formData.termLength || ''} 
                  onChange={e => setFormData({ ...formData, termLength: e.target.value === '' ? 0 : parseInt(e.target.value) })} 
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Payment Interval</label>
                <input 
                  type="text" 
                  value={formData.paymentInterval || ''} 
                  onChange={e => setFormData({ ...formData, paymentInterval: e.target.value })} 
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="e.g. 15 days"
                />
              </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2 mt-2">
                <div className="flex justify-between text-xs text-gray-500 border-b border-gray-200 pb-2 mb-2">
                    <span>Calculation:</span>
                    <span>{(parseFloat(monthlyRate) || 0)}% × {calculation.durationMonths} months = <strong>{calculation.totalRate}% Total</strong></span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">New Interest:</span>
                    <span className="font-bold text-green-600">+₱{calculation.interestAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                    <span className="text-gray-900 font-bold">New Total Loan:</span>
                    <span className="font-bold text-xl text-blue-600">₱{calculation.totalRepayment.toLocaleString()}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
              <input 
                type="date" 
                value={formData.startDate} 
                onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Penalty (₱/day)</label>
              <input 
                type="number" 
                value={formData.penaltyRate || formData.penaltyAmount || 0} 
                onChange={e => setFormData({ ...formData, penaltyRate: parseFloat(e.target.value) || 0 })} 
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
           </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition">
          <Save className="w-5 h-5" />
          Update Loan
        </button>
      </form>
    </div>
  );
};