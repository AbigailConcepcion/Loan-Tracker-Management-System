import React, { useState } from 'react';
import { Loan, Payment } from '@/types/loan';
import { PaymentScheduleView } from './PaymentScheduleView';
import { PaymentRecorder } from './PaymentRecorder';
import { ArrowLeft, Calendar, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';

interface LoanDetailsProps {
  loan: Loan;
  payments: Payment[];
  onBack: () => void;
  onRecordPayment: (payment: Partial<Payment>) => void;
}

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, payments, onBack, onRecordPayment }) => {
  const [showPaymentRecorder, setShowPaymentRecorder] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);

  const handleRecordPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentRecorder(true);
  };

  if (showPaymentRecorder && selectedPayment) {
    return (
      <PaymentRecorder
        payment={selectedPayment}
        onSubmit={(data) => {
          onRecordPayment(data);
          setShowPaymentRecorder(false);
        }}
        onCancel={() => setShowPaymentRecorder(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6">
        <button onClick={onBack} className="mb-4 p-2 active:scale-95 transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-1">{loan.customerName}</h1>
        <p className="text-blue-100 text-sm">Loan #{loan.id.slice(0, 8)}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-blue-100 text-xs mb-1">Total Amount</p>
            <p className="text-xl font-bold">₱{loan.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-blue-100 text-xs mb-1">Remaining</p>
            <p className="text-xl font-bold">₱{loan.remainingBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Loan Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal:</span>
              <span className="font-semibold">₱{loan.amountBorrowed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Rate:</span>
              <span className="font-semibold">{loan.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Frequency:</span>
              <span className="font-semibold capitalize">{loan.paymentFrequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Term:</span>
              <span className="font-semibold">{loan.termLength} payments</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-semibold">{loan.startDate}</span>
            </div>
          </div>
        </div>

        {loan.agreementPhoto && (
          <button
            onClick={() => setShowAgreement(!showAgreement)}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">View Agreement</span>
            </div>
          </button>
        )}

        {showAgreement && loan.agreementPhoto && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <img src={loan.agreementPhoto} alt="Loan Agreement" className="w-full rounded-lg" />
          </div>
        )}

        <PaymentScheduleView
          payments={payments}
          onRecordPayment={handleRecordPayment}
        />
      </div>
    </div>
  );
};
