import React from 'react';
import { Loan } from '@/types/loan';
import { Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
  onClick: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onClick }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const progress = ((loan.totalAmount - loan.remainingBalance) / loan.totalAmount) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-all active:scale-98"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{loan.customerName}</h3>
          <p className="text-sm text-gray-500">Loan #{loan.id.slice(0, 8)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[loan.status]}`}>
          {loan.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Borrowed</p>
            <p className="font-semibold">₱{loan.amountBorrowed.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="font-semibold">₱{loan.remainingBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>{loan.paymentFrequency} • {loan.termLength} payments</span>
      </div>
    </div>
  );
};
