import React, { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/loan/ImageUpload';
import { PaymentFrequency } from '@/types/loan';
import { Save, X, Calculator, Calendar } from 'lucide-react';
import { computeTotalAmount, calculateTotalInterestRate, parseIntervalToDays } from '@/utils/loanCalculations';

export interface LoanFormData {
  customerName: string;
  contactNumber: string;
  pin: string;
  amountBorrowed: number;
  interestRate: number;
  paymentInterval: string;
  paymentFrequency: PaymentFrequency; // REQUIRED by Database
  termLength: number; 
  startDate: string;
  penaltyRate: number;
  idPhoto?: string;
  agreementPhoto?: string;
  notes?: string;
}

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => void;
  onCancel: () => void;
}

export const LoanFormComponent: React.FC<LoanFormProps> = ({ onSubmit, onCancel }) => {
  const [monthlyRate, setMonthlyRate] = useState<string>('');
  
  const [formData, setFormData] = useState<LoanFormData>({
    customerName: '',
    contactNumber: '',
    pin: '',
    amountBorrowed: 0,
    interestRate: 0,
    paymentInterval: '15 days', 
    paymentFrequency: 'bi-monthly', // Default valid value
    termLength: 4,              
    startDate: new Date().toISOString().split('T')[0],
    penaltyRate: 0,
    notes: ''
  });

  const [calculation, setCalculation] = useState({
    durationMonths: 0,
    totalRate: 0,
    interestAmount: 0,
    totalRepayment: 0,
    amountPerPayment: 0
  });

  // Helper to satisfy database constraint based on text input
  const deriveFrequency = (interval: string): PaymentFrequency => {
    const lower = interval.toLowerCase();
    if (lower.includes('week')) return 'weekly';
    if (lower.includes('day')) {
        // 1 day = daily, anything else usually custom but we fallback to daily or monthly
        if (lower.includes('1 ') || lower === 'daily') return 'daily';
    }
    if (lower.includes('15') || lower.includes('bi')) return 'bi-monthly';
    return 'monthly'; // Safe fallback
  };

  useEffect(() => {
    const principal = formData.amountBorrowed || 0;
    const terms = formData.termLength || 1; 
    const interval = formData.paymentInterval || '30 days';
    const rateValue = parseFloat(monthlyRate) || 0;

    // 1. Calculate Stats
    const totalRate = calculateTotalInterestRate(rateValue, interval, terms);
    const days = parseIntervalToDays(interval) * terms;
    const durationMonths = parseFloat((days / 30).toFixed(1));
    const { totalAmount, totalInterest } = computeTotalAmount(principal, totalRate);
    const perPayment = totalAmount / terms;

    // 2. Update Hidden DB Field
    const dbFrequency = deriveFrequency(interval);

    setFormData(prev => ({ 
        ...prev, 
        interestRate: totalRate,
        paymentFrequency: dbFrequency 
    }));

    setCalculation({
      durationMonths,
      totalRate,
      interestAmount: totalInterest,
      totalRepayment: totalAmount,
      amountPerPayment: perPayment
    });
  }, [formData.amountBorrowed, monthlyRate, formData.termLength, formData.paymentInterval]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate Terms
    if (!formData.termLength || formData.termLength <= 0) {
      alert("Please enter a valid number of payments.");
      return;
    }

    // 2. Validate Date (The Fix for "Invalid time value")
    if (!formData.startDate) {
      alert("Please select a start date.");
      return;
    }
    const dateCheck = new Date(formData.startDate);
    if (isNaN(dateCheck.getTime())) {
      alert("Invalid Start Date. Please re-select the date.");
      return;
    }

    // 3. Ensure DB Field is Set
    const finalPayload = {
        ...formData,
        paymentFrequency: deriveFrequency(formData.paymentInterval)
    };

    onSubmit(finalPayload);
  };

  const updateField = (field: keyof LoanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 flex items-center gap-4 sticky top-0 z-10 shadow-md">
        <button onClick={onCancel} className="p-2 active:scale-95 transition hover:bg-blue-700 rounded-full">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">New Loan Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Client Info</h3>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={e => updateField('customerName', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="tel"
                placeholder="Contact #"
                value={formData.contactNumber}
                onChange={e => updateField('contactNumber', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none"
              />
              <input
                type="text"
                placeholder="ID/PIN"
                value={formData.pin}
                onChange={e => updateField('pin', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
             <Calculator className="w-4 h-4 text-blue-600" />
             <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Terms & Calculations</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Principal Amount (₱)</label>
              <input
                type="number"
                value={formData.amountBorrowed || ''}
                onChange={e => updateField('amountBorrowed', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold text-gray-900"
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Monthly Interest (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={monthlyRate} 
                  onChange={e => setMonthlyRate(e.target.value)} 
                  className="w-full p-3 border border-blue-200 bg-blue-50 rounded-lg font-bold text-blue-900"
                  placeholder="e.g. 15"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Number of Payments</label>
                <input 
                  type="number" 
                  value={formData.termLength || ''} 
                  onChange={e => updateField('termLength', e.target.value === '' ? 0 : parseInt(e.target.value))} 
                  className="w-full p-3 border border-gray-200 rounded-lg font-semibold" 
                  required 
                  placeholder="e.g. 4"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Payment Interval
              </label>
              <div className="flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={formData.paymentInterval} 
                  onChange={e => updateField('paymentInterval', e.target.value)} 
                  className="w-full p-3 border border-gray-200 rounded-lg" 
                  required 
                  placeholder="e.g. 15 days, 1 month"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
                <div className="flex justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                    <span>Rate Breakdown:</span>
                    <span>{(parseFloat(monthlyRate) || 0)}% × {calculation.durationMonths} months = <strong>{calculation.totalRate}% Total</strong></span>
                </div>

                <div className="flex justify-between text-sm pt-2">
                    <span className="text-gray-500">Interest Amount:</span>
                    <span className="font-medium text-green-600">+₱{calculation.interestAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Total Repayment:</span>
                    <span className="font-bold text-gray-900">₱{calculation.totalRepayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-800 font-medium">Amount per payment:</span>
                    <span className="text-xl font-bold text-blue-600">₱{calculation.amountPerPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                <input type="date" value={formData.startDate} onChange={e => updateField('startDate', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-sm" required />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Penalty Rate (₱/day)</label>
                 <input type="number" placeholder="₱" value={formData.penaltyRate || ''} onChange={e => updateField('penaltyRate', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white rounded-xl p-3 shadow-sm text-center">
              <ImageUpload label="ID Photo" value={formData.idPhoto} onChange={url => updateField('idPhoto', url)} />
           </div>
           <div className="bg-white rounded-xl p-3 shadow-sm text-center">
              <ImageUpload label="Agreement" value={formData.agreementPhoto} onChange={url => updateField('agreementPhoto', url)} />
           </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition hover:bg-blue-700">
          <Save className="w-5 h-5" />
          Save Loan Entry
        </button>
      </form>
    </div>
  );
};
