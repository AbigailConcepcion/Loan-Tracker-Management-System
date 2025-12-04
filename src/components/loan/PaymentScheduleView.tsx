import React from 'react';
import { Payment } from '@/types/loan';
import { CheckCircle, Clock, AlertCircle, Camera } from 'lucide-react';

interface PaymentScheduleViewProps {
  payments?: Payment[];
  onRecordPayment: (payment: Payment) => void;
}

export const PaymentScheduleView: React.FC<PaymentScheduleViewProps> = ({
  payments = [],
  onRecordPayment
}) => {
  const getStatusIcon = (payment: Payment) => {
    if (payment.isPaid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (payment.isOverdue) return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-amber-600" />;
  };

  const getStatusColor = (payment: Payment) => {
    if (payment.isPaid) return 'bg-green-50 border-green-200';
    if (payment.isOverdue) return 'bg-red-50 border-red-200';
    return 'bg-amber-50 border-amber-200';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Payment Schedule</h3>

      <div className="space-y-3">
        {payments.map((payment) => {
          const amountDue = payment?.amountDue || 0;
          const penalty = payment?.penalty || 0;
          const totalDue = amountDue + penalty;

          let daysOverdue = 0;
          if (payment.isOverdue && payment.dueDate) {
            const due = new Date(payment.dueDate);
            const now = new Date();
            if (!isNaN(due.getTime())) {
              daysOverdue = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
              if (daysOverdue < 0) daysOverdue = 0;
            }
          }

          return (
            <div key={payment.id} className={`border-2 rounded-xl p-4 ${getStatusColor(payment)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment)}
                  <div>
                    <p className="font-semibold text-gray-900">Payment #{payment.paymentNumber}</p>
                    <p className="text-sm text-gray-600">Due: {payment.dueDate || '—'}</p>
                    {payment.isOverdue && daysOverdue > 0 && (
                      <p className="text-xs text-red-600 font-semibold mt-1">
                        {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₱{amountDue.toLocaleString()}</p>
                  {penalty > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-red-600 font-semibold">
                        +₱{penalty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} penalty
                      </p>
                      <p className="text-xs text-gray-900 font-bold mt-1">
                        Total: ₱{totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {payment.isPaid ? (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Paid:</span>
                    <span className="font-semibold">₱{(payment.amountPaid || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{payment.paidDate || '—'}</span>
                  </div>
                  {payment.receiptPhoto && (
                    <img src={payment.receiptPhoto} alt="Receipt" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onRecordPayment(payment)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-98 transition"
                >
                  <Camera className="w-5 h-5" />
                  Record Payment
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
