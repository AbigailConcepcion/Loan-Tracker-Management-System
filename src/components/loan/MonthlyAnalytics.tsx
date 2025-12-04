import React, { useState, useMemo } from 'react';
import { Loan, Payment } from '@/types/loan';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Wallet, Activity } from 'lucide-react';
import { getLoanStats } from '@/utils/loanCalculations';

interface MonthlyAnalyticsProps {
  loans: Loan[];
  payments: Payment[];
}

export const MonthlyAnalytics: React.FC<MonthlyAnalyticsProps> = ({ loans = [], payments = [] }) => {

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Helper to parse "YYYY-MM"
  const parseMonth = (m: string) => {
    const [y, mon] = m.split('-').map(Number);
    return { year: y, month: mon };
  };

  // --- CORE DATA CALCULATOR ---
  const getMonthMetrics = (monthStr: string) => {
    const { year, month } = parseMonth(monthStr);

    // 1. Money In (Collections)
    const monthPayments = payments.filter(p => {
      if (!p.paidDate) return false;
      const d = new Date(p.paidDate);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    const totalCollected = monthPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    // 2. Money Out (New Loans Released)
    const monthLoans = loans.filter(l => {
      const d = new Date(l.startDate);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    const capitalReleased = monthLoans.reduce((sum, l) => sum + l.amountBorrowed, 0);

    // 3. Expected Due (Target Collection)
    // We scan ALL loans to see what scheduled payments fell in this month
    let expectedDue = 0;
    loans.forEach(loan => {
      const stats = getLoanStats(loan, payments); // Recalculate schedule
      stats.schedule.forEach(item => {
        const dueDate = new Date(item.dueDate);
        if (dueDate.getFullYear() === year && dueDate.getMonth() + 1 === month) {
          expectedDue += item.totalAmount;
        }
      });
    });

    return {
      monthStr,
      totalCollected,
      paymentsCount: monthPayments.length,
      capitalReleased,
      newLoansCount: monthLoans.length,
      expectedDue,
      netCashFlow: totalCollected - capitalReleased,
      collectionRate: expectedDue > 0 ? (totalCollected / expectedDue) * 100 : 0
    };
  };

  // --- TREND DATA GENERATOR (Last 6 Months) ---
  const trendData = useMemo(() => {
    const data = [];
    const { year: currentYear, month: currentMonth } = parseMonth(selectedMonth);
    
    // Go back 5 months + current
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const metrics = getMonthMetrics(mStr);
      data.push({
        label: d.toLocaleString('default', { month: 'short' }),
        value: metrics.totalCollected,
        isCurrent: i === 0
      });
    }
    return data;
  }, [selectedMonth, loans, payments]);

  // Derived Data for Current View
  const currentMetrics = getMonthMetrics(selectedMonth);
  const maxCollection = Math.max(...trendData.map(d => d.value), 1); // For chart scaling

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" /> Analytics
          </h1>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white/20 border border-white/30 text-white px-3 py-1 rounded-lg backdrop-blur-md outline-none focus:bg-white/30"
          />
        </div>

        {/* MAIN CASH FLOW CARD */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-2">
          <p className="text-indigo-200 text-xs uppercase tracking-wider mb-1">Net Cash Flow (In - Out)</p>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${currentMetrics.netCashFlow >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {currentMetrics.netCashFlow >= 0 ? '+' : '-'}₱{Math.abs(currentMetrics.netCashFlow).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-2">
            Collected ₱{currentMetrics.totalCollected.toLocaleString()} vs Released ₱{currentMetrics.capitalReleased.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        
        {/* 1. COLLECTION EFFICIENCY */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Collection Efficiency</h3>
              <p className="text-2xl font-bold text-gray-900">{currentMetrics.collectionRate.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Target</p>
              <p className="text-sm font-semibold text-gray-700">₱{currentMetrics.expectedDue.toLocaleString()}</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                currentMetrics.collectionRate >= 90 ? 'bg-green-500' : 
                currentMetrics.collectionRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(currentMetrics.collectionRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            You collected <strong>₱{currentMetrics.totalCollected.toLocaleString()}</strong> of the expected ₱{currentMetrics.expectedDue.toLocaleString()}
          </p>
        </div>

        {/* 2. SIX MONTH TREND CHART */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> 6-Month Collection Trend
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {trendData.map((data, idx) => {
              const heightPct = (data.value / maxCollection) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex items-end justify-center h-full">
                     <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${data.isCurrent ? 'bg-indigo-600' : 'bg-indigo-200 group-hover:bg-indigo-300'}`}
                        style={{ height: `${heightPct}%` }}
                     />
                     {/* Tooltip */}
                     <div className="absolute -top-8 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ₱{data.value.toLocaleString()}
                     </div>
                  </div>
                  <span className={`text-[10px] font-medium ${data.isCurrent ? 'text-indigo-700' : 'text-gray-400'}`}>
                    {data.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. DETAILED METRICS GRID */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-gray-500 text-xs">Total Collected</p>
            <p className="text-lg font-bold text-gray-900">₱{currentMetrics.totalCollected.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
              <Wallet className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-gray-500 text-xs">Capital Released</p>
            <p className="text-lg font-bold text-gray-900">₱{currentMetrics.capitalReleased.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-gray-500 text-xs">New Loans</p>
            <p className="text-lg font-bold text-gray-900">{currentMetrics.newLoansCount}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-gray-500 text-xs">Txns Count</p>
            <p className="text-lg font-bold text-gray-900">{currentMetrics.paymentsCount}</p>
          </div>
        </div>

      </div>
    </div>
  );
};