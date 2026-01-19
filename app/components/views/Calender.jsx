import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h2>
          <p className="text-gray-500 dark:text-gray-400">October 2023</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button className="px-4 py-2 text-sm font-semibold hover:bg-white dark:hover:bg-zinc-800 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
            Today
          </button>
          <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-gray-50 dark:border-zinc-800/50 p-2 bg-gray-50/30 dark:bg-zinc-900/20" />
          ))}
          {dates.map(date => (
            <div key={date} className="border-r border-b border-gray-50 dark:border-zinc-800/50 p-3 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
              <span className={`text-sm font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full ${date === 25 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400'}`}>
                {date}
              </span>
              {date === 25 && (
                <div className="mt-2 space-y-1">
                  <div className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 truncate">
                    Sync Mktg
                  </div>
                  <div className="text-[10px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 truncate">
                    Deadline P
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};