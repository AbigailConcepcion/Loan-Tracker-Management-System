import React from 'react';
import { DollarSign, Calendar, Camera, TrendingUp, Plus } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 flex flex-col justify-center">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
          <DollarSign className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Loan Manager</h1>
        <p className="text-blue-100 text-lg">Your personal loan tracking system</p>
      </div>

      <div className="space-y-6 mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Track Payments</h3>
              <p className="text-blue-100 text-sm">Automated payment schedules with customizable terms</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Upload Documents</h3>
              <p className="text-blue-100 text-sm">Store agreements, IDs, and payment receipts</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Financial Reports</h3>
              <p className="text-blue-100 text-sm">View summaries, collection rates, and analytics</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onGetStarted}
        className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
        Create Your First Loan
      </button>

      <p className="text-center text-blue-100 text-sm mt-6">
        All data is stored locally on your device
      </p>
    </div>
  );
};
