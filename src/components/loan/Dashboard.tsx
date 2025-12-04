import React, { useMemo, useState } from 'react';
import { LoanCard } from './LoanCard';
import { SearchFilter } from './SearchFilter';
import { NotificationReminders } from './NotificationReminders';
import { Loan, LoanStatus, PaymentFrequency, Payment } from '@/types/loan';
import { Plus, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { getLoanStats } from '@/utils/loanCalculations';

interface DashboardProps {
  loans: Loan[];
  payments: Payment[];
  onCreateLoan: () => void;
  onSelectLoan: (loan: Loan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  loans = [],
  payments = [],
  onCreateLoan,
  onSelectLoan
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<PaymentFrequency | 'all'>('all');

  // Compute stats for all loans once
  const enhancedLoans = useMemo(() => {
    return loans.map(loan => {
      const stats = getLoanStats(loan, payments);
      return { ...loan, stats };
    });
  }, [loans, payments]);

  const filteredLoans = enhancedLoans.filter(loan => {
    const matchesSearch = loan.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.stats.status === statusFilter;
    // Note: handling legacy frequency filter might be tricky with custom intervals, 
    // keeping basic check for now
    const matchesFrequency = frequencyFilter === 'all' || loan.paymentFrequency === frequencyFilter;
    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setFrequencyFilter('all');
  };

  const totalOutstanding = filteredLoans.reduce((sum, l) => sum + l.stats.outstanding, 0);
  const activeLoans = filteredLoans.filter(l => l.stats.status === 'active').length;
  const overdueLoans = filteredLoans.filter(l => l.stats.status === 'overdue').length;
  const completedLoans = filteredLoans.filter(l => l.stats.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Loan Manager</h1>
        <p className="text-blue-100 text-sm">Track and manage all loans</p>

        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-blue-100 text-sm mb-1">Total Outstanding Balance</p>
          <p className="text-3xl font-bold">
            ₱{totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Status Counters */}
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

        <div className="mb-6">
          <NotificationReminders loans={loans} payments={payments} />
        </div>

        <SearchFilter
          onSearch={setSearchQuery}
          onFilterStatus={setStatusFilter}
          onFilterFrequency={setFrequencyFilter}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          frequencyFilter={frequencyFilter}
        />

        <div className="flex justify-between items-center my-4">
          <h2 className="text-lg font-bold text-gray-900">
            {filteredLoans.length === enhancedLoans.length ? `All Loans (${enhancedLoans.length})` : `Showing ${filteredLoans.length}`}
          </h2>
          <button onClick={onCreateLoan} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md active:scale-95 transition">
            <Plus className="w-5 h-5" />
            New
          </button>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 mb-2">No loans found</p>
            <button onClick={resetFilters} className="text-blue-600 hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLoans.map(item => (
              <LoanCard 
                key={item.id} 
                loan={item} // Passing the raw loan, LoanCard will re-calc or we can pass stats if we refactor LoanCard
                payments={payments} 
                onClick={() => onSelectLoan(item)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
