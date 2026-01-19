import React from 'react';
import { Repeat, Clock } from 'lucide-react';

export const DailyTasks = () => {
  const dailyTasks = [
    { id: 'd1', title: 'Daily Standup', time: '09:30 AM' },
    { id: 'd2', title: 'E-mail Clearance', time: '10:00 AM' },
    { id: 'd3', title: 'Lunch Break', time: '12:30 PM' },
    { id: 'd4', title: 'Evening Wrap-up', time: '05:00 PM' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Daily Routines
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Recurring items that build your productivity habit.</p>
      </header>

      <div className="grid gap-4">
        {dailyTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-5 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-zinc-600 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500">
                <Repeat size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <Clock size={12} />
                  <span>Resets every 24 hours</span>
                </div>
              </div>
            </div>
            <div className="text-sm font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
              {task.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};