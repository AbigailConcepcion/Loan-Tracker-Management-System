import React from 'react';
import { Loan, Payment } from '@/types/loan';
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';

interface SummaryReportProps {
  loans: Loan[];
  payments: Payment[];
}

export const SummaryReport: React.FC<SummaryReportProps> = ({ loans, payments }) => {
  const totalLent = loans.reduce((sum, loan) => sum + loan.amountBorrowed, 0);
  const totalExpected = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalCollected = payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amountPaid, 0);
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const totalPenalties = payments.reduce((sum, p) => sum + p.penalty, 0);
  
  const activeLoans = loans.filter(l => l.status === 'active');
  const overdueLoans = loans.filter(l => l.status === 'overdue');
  const completedLoans = loans.filter(l => l.status === 'completed');
  
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Summary Report</h1>
        <p className="text-blue-100 text-sm">Financial overview and statistics</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Lent</span>
              <span className="font-bold text-lg">₱{totalLent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Expected Return</span>
              <span className="font-bold text-lg text-green-600">₱{totalExpected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Collected</span>
              <span className="font-bold text-lg text-blue-600">₱{totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Outstanding</span>
              <span className="font-bold text-lg text-amber-600">₱{totalOutstanding.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Penalties</span>
              <span className="font-bold text-lg text-red-600">₱{totalPenalties.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Collection Rate
          </h3>
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold text-gray-900">{collectionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(collectionRate, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ₱{totalCollected.toLocaleString()} of ₱{totalExpected.toLocaleString()} collected
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-700">{activeLoans.length}</p>
            <p className="text-xs text-green-600 mt-1">Active</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-3xl font-bold text-red-700">{overdueLoans.length}</p>
            <p className="text-xs text-red-600 mt-1">Overdue</p>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
            <p className="text-3xl font-bold text-gray-700">{completedLoans.length}</p>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};
