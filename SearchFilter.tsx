import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { LoanStatus, PaymentFrequency } from '@/types/loan';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: LoanStatus | 'all') => void;
  onFilterFrequency: (frequency: PaymentFrequency | 'all') => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ 
  onSearch, 
  onFilterStatus, 
  onFilterFrequency 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-blue-600 font-medium"
      >
        <Filter className="w-4 h-4" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              onChange={(e) => onFilterStatus(e.target.value as LoanStatus | 'all')}
              className="w-full p-2 border rounded-lg text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
            <select
              onChange={(e) => onFilterFrequency(e.target.value as PaymentFrequency | 'all')}
              className="w-full p-2 border rounded-lg text-base"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-monthly">Bi-Monthly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
