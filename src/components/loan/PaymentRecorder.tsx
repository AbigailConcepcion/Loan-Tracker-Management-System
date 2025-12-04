import React, { useState } from 'react';
import { Payment } from '@/types/loan';
import { ImageUpload } from './ImageUpload';
import { Save, X } from 'lucide-react';

interface PaymentRecorderProps {
  payment?: Payment;
  onSubmit: (data: Partial<Payment>) => void;
  onCancel: () => void;
}

export const PaymentRecorder: React.FC<PaymentRecorderProps> = ({
  payment,
  onSubmit,
  onCancel
}) => {
  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading payment details...
      </div>
    );
  }

  const [amountPaid, setAmountPaid] = useState(payment.amountDue + (payment.penalty || 0));
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptPhoto, setReceiptPhoto] = useState<string>();
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...payment,
      amountPaid,
      paidDate,
      receiptPhoto,
      notes,
      isPaid: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 active:scale-95 transition">
          <X className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Record Payment</h1>
          <p className="text-sm text-blue-100">Payment #{payment.paymentNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Due Amount:</span>
              <span className="font-semibold">₱{payment.amountDue.toLocaleString()}</span>
            </div>
            {payment.penalty > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Penalty:</span>
                <span className="font-semibold text-red-600">₱{payment.penalty.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-900 font-semibold">Total Due:</span>
              <span className="font-bold text-lg">
                ₱{(payment.amountDue + (payment.penalty || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₱)</label>
          <input
            type="number"
            step="0.01"
            value={amountPaid}
            onChange={e => setAmountPaid(parseFloat(e.target.value))}
            className="w-full p-3 border rounded-lg text-base"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
          <input
            type="date"
            value={paidDate}
            onChange={e => setPaidDate(e.target.value)}
            className="w-full p-3 border rounded-lg text-base"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <ImageUpload
            label="Payment Receipt Photo"
            value={receiptPhoto}
            onChange={setReceiptPhoto}
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-3 border rounded-lg text-base"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition"
        >
          <Save className="w-5 h-5" />
          Save Payment
        </button>
      </form>
    </div>
  );
};
