import React from 'react';
import { History, Search } from 'lucide-react';

export const TaskHistory = () => {
  const history = [
    { date: 'Yesterday', tasks: ['Submit Tax Returns', 'Call Dentist', 'Grocery Shopping'] },
    { date: 'Oct 24, 2023', tasks: ['Finish Frontend Mockup', 'Weekly Team Sync'] },
    { date: 'Oct 23, 2023', tasks: ['Fix login bugs', 'Documentation update'] },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Completed Tasks
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="pl-10 pr-4 py-2 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="space-y-8">
        {history.map((section, idx) => (
          <section key={idx}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{section.date}</h3>
            <div className="space-y-3">
              {section.tasks.map((task, tidx) => (
                <div key={tidx} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-zinc-800/30 rounded-xl border border-gray-100 dark:border-zinc-800 opacity-70">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <History size={12} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{task}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};