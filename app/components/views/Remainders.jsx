import React from 'react';
import { Bell, Clock, Calendar } from 'lucide-react';

export const Reminders = () => {
  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h2>
        <p className="text-gray-500 dark:text-gray-400">Never miss a critical deadline.</p>
      </header>

      <div className="grid gap-4">
        <div className="p-6 bg-white dark:bg-[#1f1f1f] rounded-2xl border-l-4 border-red-500 shadow-sm flex items-center justify-between">
          <div className="flex gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Project Deadline: Vanguard</h3>
              <p className="text-sm text-gray-500 mt-1">The final proposal must be submitted by 5:00 PM today.</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded">
                  <Clock size={12} /> Priority 1
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={12} /> Oct 25, 2023
                </span>
              </div>
            </div>
          </div>
          <button className="text-sm font-semibold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-colors">
            Dismiss
          </button>
        </div>
        
        <div className="p-6 bg-white dark:bg-[#1f1f1f] rounded-2xl border-l-4 border-yellow-500 shadow-sm flex items-center justify-between">
           <div className="flex gap-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-full text-yellow-500">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Check Analytics Report</h3>
              <p className="text-sm text-gray-500 mt-1">Review the monthly traffic stats before the meeting.</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};