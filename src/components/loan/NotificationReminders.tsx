import React from 'react';
import { Bell, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loan, Payment } from '@/types/loan';
import { getLoanStats } from '@/utils/loanCalculations';
import { format, differenceInDays } from 'date-fns';

interface NotificationRemindersProps {
  loans: Loan[];
  payments: Payment[];
}

export const NotificationReminders: React.FC<NotificationRemindersProps> = ({
  loans = [],
  payments = []
}) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  // Aggregate all actionable items from all loans
  const allItems = loans.flatMap(loan => {
    const stats = getLoanStats(loan, payments);
    return stats.schedule.map(item => ({
      ...item,
      loanName: loan.customerName,
      loanId: loan.id
    }));
  });

  // Filter Categories
  const overdue = allItems.filter(i => i.isPastDue && !i.isPaid);
  
  const dueToday = allItems.filter(i => {
    const d = new Date(i.dueDate); 
    d.setHours(0,0,0,0);
    return !i.isPaid && d.getTime() === today.getTime();
  });

  const upcoming = allItems.filter(i => {
    if (i.isPaid || i.isPastDue) return false;
    const d = new Date(i.dueDate); d.setHours(0,0,0,0);
    const diff = differenceInDays(d, today);
    return diff > 0 && diff <= 7;
  });

  const totalAlerts = overdue.length + dueToday.length + upcoming.length;

  return (
    <Card className="w-full border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <Bell className="h-5 w-5 text-blue-600" />
          Reminders
        </CardTitle>
        {totalAlerts > 0 && <Badge variant="destructive" className="animate-pulse">{totalAlerts}</Badge>}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {overdue.length > 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="font-bold mb-2">Overdue ({overdue.length})</div>
              <div className="space-y-1">
                {overdue.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.loanName}</span>
                    <span className="font-medium text-red-600">{item.daysOverdue} days late</span>
                  </div>
                ))}
                {overdue.length > 3 && <div className="text-xs text-red-500 mt-1">+{overdue.length - 3} more</div>}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {dueToday.length > 0 && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <Calendar className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <div className="font-bold mb-2">Due Today ({dueToday.length})</div>
              {dueToday.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                   <span>{item.loanName}</span>
                   <span className="font-bold">₱{item.totalAmount.toLocaleString()}</span>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {upcoming.length > 0 && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-900">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="font-bold mb-2">Upcoming ({upcoming.length})</div>
              {upcoming.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.loanName}</span>
                  <span className="text-xs bg-white/50 px-2 py-0.5 rounded">
                    {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                  </span>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {totalAlerts === 0 && (
          <div className="text-center py-6 text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">All caught up! No pending payments.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};