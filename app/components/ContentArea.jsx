import React from 'react';
import { TodayTasks } from './views/TodayTasks';
import { DailyTasks } from './views/DailyTask';
import { Analytics } from './views/Analytics';
import { TaskHistory } from './views/TaskHistory';
import { AIFeedback } from './views/AIFeedback';
import { Reminders } from './views/Remainders';
import { Calendar } from './views/Calender';
import Dashboard from './Dashboard';

const ViewType = {
  DASHBOARD: 'DASHBOARD',
  ANALYTICS: 'ANALYTICS',
  AI_FEEDBACK: 'AI_FEEDBACK',
  REMINDERS: 'REMINDERS',
  CALENDAR: 'CALENDAR'
};

export const ContentArea = ({ activeView }) => {
  const renderView = () => {
    switch (activeView) {
      case ViewType.DASHBOARD: return <Dashboard />;
      case ViewType.ANALYTICS: return <Analytics />;
      case ViewType.AI_FEEDBACK: return <AIFeedback />;
      case ViewType.REMINDERS: return <Reminders />;
      case ViewType.CALENDAR: return <Calendar />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#111111] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </div>
    </div>
  );
};