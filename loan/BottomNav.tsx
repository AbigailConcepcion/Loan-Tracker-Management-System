import React from 'react';
import { Home, FileText, Plus, TrendingUp } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'reports' | 'create' | 'analytics';
  onTabChange: (tab: 'dashboard' | 'reports' | 'create' | 'analytics') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as const, icon: Home, label: 'Home' },
    { id: 'analytics' as const, icon: TrendingUp, label: 'Analytics' },
    { id: 'create' as const, icon: Plus, label: 'New' },
    { id: 'reports' as const, icon: FileText, label: 'Reports' }
  ];


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-4 h-16">

        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 active:bg-gray-100'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
