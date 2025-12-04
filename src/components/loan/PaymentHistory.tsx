import React from 'react';
import { Payment } from '@/types/loan';
import { CheckCircle, Calendar } from 'lucide-react';

interface PaymentHistoryProps {
  payments?: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments = [] }) => {
  const paidPayments = (payments ?? []).filter(p => p?.isPaid);

  if (paidPayments.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
        <p className="text-gray-500 text-center py-8">No payments recorded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>

      <div className="space-y-3">
        {paidPayments.map(payment => (
          <div
            key={payment.id}
            className="border-2 border-green-200 bg-green-50 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Payment #{payment.paymentNumber}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {payment.paidDate || '—'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-green-600">
                  ₱{(payment.amountPaid || 0).toLocaleString()}
                </p>

                {payment.penalty && payment.penalty > 0 && (
                  <p className="text-xs text-red-600">
                    +₱{payment.penalty.toFixed(2)} penalty
                  </p>
                )}
              </div>
            </div>

            {payment.receiptPhoto && (
              <img
                src={payment.receiptPhoto}
                alt="Receipt"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}

            {payment.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">
                {payment.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
