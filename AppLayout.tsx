import React, { useState } from 'react';
import { Dashboard } from './loan/Dashboard';
import { LoanFormComponent } from './loan/LoanFormComponent';
import { LoanDetails } from './loan/LoanDetails';
import { SummaryReport } from './loan/SummaryReport';
import { BottomNav } from './loan/BottomNav';
import { WelcomeScreen } from './loan/WelcomeScreen';
import { useLoanData } from '@/hooks/useLoanData';
import { Loan } from '@/types/loan';

type View = 'dashboard' | 'create' | 'details' | 'reports';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { loans, payments, createLoan, recordPayment, getLoanPayments } = useLoanData();
  const [showWelcome, setShowWelcome] = useState(loans.length === 0);

  const handleGetStarted = () => {
    setShowWelcome(false);
    setCurrentView('create');
  };

  const handleCreateLoan = (data: any) => {
    createLoan(data);
    setShowWelcome(false);
    setCurrentView('dashboard');
  };


  const handleSelectLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setCurrentView('details');
  };

  const handleRecordPayment = (paymentData: any) => {
    recordPayment(paymentData);
  };

  const handleNavChange = (tab: 'dashboard' | 'reports' | 'create') => {
    setCurrentView(tab);
  };

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {currentView === 'dashboard' && (
        <Dashboard
          loans={loans}
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

      {currentView === 'details' && selectedLoan && (
        <LoanDetails
          loan={selectedLoan}
          payments={getLoanPayments(selectedLoan.id)}
          onBack={() => setCurrentView('dashboard')}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {(currentView === 'dashboard' || currentView === 'reports') && (
        <BottomNav
          activeTab={currentView === 'reports' ? 'reports' : 'dashboard'}
          onTabChange={handleNavChange}
        />
      )}
    </div>
  );
};

export default AppLayout;
