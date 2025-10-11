import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { PaymentFrequency } from '@/types/loan';
import { Save, X } from 'lucide-react';

export interface LoanFormData {
  customerName: string;
  contactNumber: string;
  pin: string;
  amountBorrowed: number;
  interestRate: number;
  paymentFrequency: PaymentFrequency;
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
  const [formData, setFormData] = useState<LoanFormData>({
    customerName: '',
    contactNumber: '',
    pin: '',
    amountBorrowed: 0,
    interestRate: 0,
    paymentFrequency: 'monthly',
    termLength: 1,
    startDate: new Date().toISOString().split('T')[0],
    penaltyRate: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof LoanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 active:scale-95 transition">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Create New Loan</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={e => updateField('customerName', e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 text-base"
            required
          />
          <input
            type="tel"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={e => updateField('contactNumber', e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 text-base"
          />
          <input
            type="text"
            placeholder="PIN/ID Number"
            value={formData.pin}
            onChange={e => updateField('pin', e.target.value)}
            className="w-full p-3 border rounded-lg text-base"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <ImageUpload
            label="Customer ID Photo"
            value={formData.idPhoto}
            onChange={url => updateField('idPhoto', url)}
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Loan Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Borrowed (₱)</label>
              <input
                type="number"
                value={formData.amountBorrowed || ''}
                onChange={e => updateField('amountBorrowed', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-lg text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input type="number" step="0.01" value={formData.interestRate || ''} onChange={e => updateField('interestRate', parseFloat(e.target.value) || 0)} className="w-full p-3 border rounded-lg text-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
              <select value={formData.paymentFrequency} onChange={e => updateField('paymentFrequency', e.target.value)} className="w-full p-3 border rounded-lg text-base">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-monthly">Bi-Monthly (15 days)</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term Length (# of payments)</label>
              <input type="number" value={formData.termLength || ''} onChange={e => updateField('termLength', parseInt(e.target.value) || 1)} className="w-full p-3 border rounded-lg text-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={e => updateField('startDate', e.target.value)} className="w-full p-3 border rounded-lg text-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Rate (% per day overdue)</label>
              <input type="number" step="0.01" value={formData.penaltyRate || ''} onChange={e => updateField('penaltyRate', parseFloat(e.target.value) || 0)} className="w-full p-3 border rounded-lg text-base" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <ImageUpload label="Loan Agreement Photo" value={formData.agreementPhoto} onChange={url => updateField('agreementPhoto', url)} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea value={formData.notes} onChange={e => updateField('notes', e.target.value)} className="w-full p-3 border rounded-lg text-base" rows={3} placeholder="Additional notes or terms..." />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition">
          <Save className="w-5 h-5" />
          Create Loan
        </button>
      </form>
    </div>
  );
};
