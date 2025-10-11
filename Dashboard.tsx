import React, { useState } from 'react';
import { LoanCard } from './LoanCard';
import { SearchFilter } from './SearchFilter';
import { Loan, LoanStatus, PaymentFrequency } from '@/types/loan';
import { Plus, DollarSign, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  loans: Loan[];
  onCreateLoan: () => void;
  onSelectLoan: (loan: Loan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ loans, onCreateLoan, onSelectLoan }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<PaymentFrequency | 'all'>('all');

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'all' || loan.paymentFrequency === frequencyFilter;
    return matchesSearch && matchesStatus && matchesFrequency;
  });
  const totalOutstanding = filteredLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const activeLoans = filteredLoans.filter(l => l.status === 'active').length;
  const overdueLoans = filteredLoans.filter(l => l.status === 'overdue').length;
  const completedLoans = filteredLoans.filter(l => l.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Loan Manager</h1>
        <p className="text-blue-100 text-sm">Track and manage all loans</p>
        
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-blue-100 text-sm mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold">₱{totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overdueLoans}</p>
            <p className="text-xs text-gray-500">Overdue</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <TrendingUp className="w-5 h-5 text-gray-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedLoans}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>

        <SearchFilter
          onSearch={setSearchQuery}
          onFilterStatus={setStatusFilter}
          onFilterFrequency={setFrequencyFilter}
        />

        <div className="flex justify-between items-center my-4">
          <h2 className="text-lg font-bold text-gray-900">
            {filteredLoans.length === loans.length 
              ? `All Loans (${loans.length})` 
              : `Filtered (${filteredLoans.length} of ${loans.length})`}
          </h2>
          <button
            onClick={onCreateLoan}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md active:scale-95 transition"
          >
            <Plus className="w-5 h-5" />
            New
          </button>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No loans found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLoans.map(loan => (
              <LoanCard key={loan.id} loan={loan} onClick={() => onSelectLoan(loan)} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
