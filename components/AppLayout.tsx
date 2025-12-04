import React, { useState } from 'react';
import { Dashboard } from './loan/Dashboard';
import { LoanFormComponent } from './loan/LoanFormComponent';
import { LoanDetails } from './loan/LoanDetails';
import { SummaryReport } from './loan/SummaryReport';
import { MonthlyAnalytics } from './loan/MonthlyAnalytics';
import { BottomNav } from './loan/BottomNav';
import { useLoanData } from '@/hooks/useLoanData';
import { Loan } from '@/types/loan';


type View = 'dashboard' | 'create' | 'details' | 'reports' | 'analytics';


const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { loans, payments, createLoan, recordPayment, getLoanPayments, updateLoan } = useLoanData();

  const handleCreateLoan = (data: any) => {
    createLoan(data);
    setCurrentView('dashboard');
  };

  const handleSelectLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setCurrentView('details');
  };

  const handleRecordPayment = (paymentData: any) => {
    recordPayment(paymentData);
  };

  const handleUpdateLoan = (updatedLoan: Loan) => {
    updateLoan(updatedLoan);
    setSelectedLoan(updatedLoan);
  };

  const handleNavChange = (tab: 'dashboard' | 'reports' | 'create' | 'analytics') => {
    setCurrentView(tab);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && (
        <Dashboard
          loans={loans}
          payments={payments}
          onCreateLoan={() => setCurrentView('create')}
          onSelectLoan={handleSelectLoan}
        />
      )}


      {currentView === 'create' && (
        <LoanFormComponent
          onSubmit={handleCreateLoan}
          onCancel={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'reports' && (
        <SummaryReport loans={loans} payments={payments} />
      )}

      {currentView === 'analytics' && (
        <MonthlyAnalytics loans={loans} payments={payments} />
      )}

      {currentView === 'details' && selectedLoan && (
        <LoanDetails
          loan={selectedLoan}
          payments={getLoanPayments(selectedLoan.id)}
          onBack={() => setCurrentView('dashboard')}
          onRecordPayment={handleRecordPayment}
          onUpdateLoan={handleUpdateLoan}
        />
      )}

      {(currentView === 'dashboard' || currentView === 'reports' || currentView === 'analytics' || currentView === 'create') && (
        <BottomNav
          activeTab={currentView === 'reports' ? 'reports' : currentView === 'analytics' ? 'analytics' : currentView === 'create' ? 'create' : 'dashboard'}
          onTabChange={handleNavChange}
        />
      )}


    </div>
  );
};

export default AppLayout;
