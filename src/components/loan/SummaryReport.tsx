import React from 'react';
import { Loan, Payment } from '@/types/loan';
import { TrendingUp, FileSpreadsheet } from 'lucide-react';
import { getLoanStats } from '@/utils/loanCalculations';

interface SummaryReportProps {
  loans: Loan[];
  payments: Payment[];
}

export const SummaryReport: React.FC<SummaryReportProps> = ({ loans, payments }) => {
  // 1. Financial Aggregates
  const loanStats = loans.map(loan => ({
    loan,
    stats: getLoanStats(loan, payments)
  }));

  const totalLent = loans.reduce((sum, loan) => sum + loan.amountBorrowed, 0);
  const totalExpected = loanStats.reduce((sum, { loan, stats }) => sum + loan.totalAmount + stats.totalPenalties, 0);
  const totalProfit = totalExpected - totalLent;
  
  // 2. EXPORT FUNCTION (Clean CSV - Guaranteed to Open)
  const handleExportToExcel = () => {
    // A. Define Headers
    const headers = [
      "Client Name",
      "Renewal Date",
      "Renewal Amount",
      "Total Interest",
      "Penalties",
      "Total Due",
      "Total Paid",
      "Outstanding",
      "Next Due Date",
      "Status"
    ];

    // B. Build Rows
    const rows = loanStats.map(({ loan, stats }) => {
      const profit = loan.totalAmount - loan.amountBorrowed;
      const nextDue = stats.nextDueDate || "Done";
      
      // Helper to safely escape quotes and wrap in quotes
      const safe = (text: string | number) => `"${String(text).replace(/"/g, '""')}"`;

      return [
        safe(loan.customerName),
        safe(loan.startDate),
        safe(loan.amountBorrowed),
        safe(profit),
        safe(stats.totalPenalties),
        safe(loan.totalAmount + stats.totalPenalties),
        safe(stats.totalPaid),
        safe(stats.outstanding),
        safe(nextDue),
        safe(stats.status.toUpperCase())
      ];
    });

    // C. Create CSV String (No BOM, No HTML)
    const csvContent = [
      headers.join(","), 
      ...rows.map(e => e.join(","))
    ].join("\n");

    // D. Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Loan_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Master Summary</h1>
          <button 
            onClick={handleExportToExcel} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md active:scale-95 transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-blue-200 text-[10px] uppercase tracking-wider">Capital Out</p>
            <p className="text-lg font-bold">₱{totalLent.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-blue-200 text-[10px] uppercase tracking-wider">Proj. Profit</p>
            <p className="text-lg font-bold text-green-300">+₱{totalProfit.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-blue-200 text-[10px] uppercase tracking-wider">Total Expected</p>
            <p className="text-lg font-bold">₱{totalExpected.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Loan Ledger</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10">Client</th>
                  <th className="px-4 py-3 font-semibold text-blue-700 bg-blue-50">Renewal Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-blue-700 bg-blue-50">Renewal Amt</th>
                  <th className="px-4 py-3 text-right">Interest</th>
                  <th className="px-4 py-3 text-right text-red-600">Penalties</th>
                  <th className="px-4 py-3 text-right font-bold">Total Due</th>
                  <th className="px-4 py-3 text-right text-green-600">Paid</th>
                  <th className="px-4 py-3 text-right font-bold">Balance</th>
                  <th className="px-4 py-3 text-center">Next Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loanStats.map(({ loan, stats }) => {
                  const interest = loan.totalAmount - loan.amountBorrowed;
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900 sticky left-0 bg-white border-r border-gray-100">
                        {loan.customerName}
                      </td>
                      <td className="px-4 py-3 text-gray-700 bg-blue-50/30">{loan.startDate}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 bg-blue-50/30">
                        ₱{loan.amountBorrowed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600">+₱{interest.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-red-500">
                        {stats.totalPenalties > 0 ? `+₱${stats.totalPenalties}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ₱{(loan.totalAmount + stats.totalPenalties).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-600">
                        ₱{stats.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        ₱{stats.outstanding.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {stats.nextDueDate || 'Done'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};