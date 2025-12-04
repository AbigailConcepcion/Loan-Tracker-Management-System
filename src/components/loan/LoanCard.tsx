import React, { useMemo } from 'react';
import { Loan, Payment } from '@/types/loan';
import { Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { getLoanStats } from '@/utils/loanCalculations';

interface LoanCardProps {
  loan: Loan;
  payments?: Payment[];
  onClick: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, payments = [], onClick }) => {
  const stats = useMemo(() => getLoanStats(loan, payments), [loan, payments]);

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-all active:scale-98 border border-transparent hover:border-blue-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{loan.customerName}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
             <span>Loan #{loan.id.slice(0, 8)}</span>
             {stats.nextDueDate && stats.status !== 'completed' && (
               <span className={`text-xs px-2 py-0.5 rounded ${stats.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                 Due: {stats.nextDueDate}
               </span>
             )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[stats.status]}`}>
          {stats.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Principal</p>
            <p className="font-semibold">₱{loan.amountBorrowed.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Outstanding</p>
            <p className={`font-semibold ${stats.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
              ₱{stats.outstanding.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{stats.progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${stats.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'}`}
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {/* Show Interval if available, else Frequency */}
          <span>{loan.paymentInterval || loan.paymentFrequency} • {loan.termLength} terms</span>
        </div>
        {stats.totalPenalties > 0 && (
           <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
             <AlertTriangle className="w-3 h-3" />
             <span>+₱{stats.totalPenalties.toLocaleString()} Pen.</span>
           </div>
        )}
      </div>
    </div>
  );
};
