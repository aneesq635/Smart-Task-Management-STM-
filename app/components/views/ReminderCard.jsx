import React from 'react';
import { Bell, Clock, Calendar, Trash2 } from 'lucide-react';

export const ReminderCard = ({ reminder, onDismiss }) => {
  const getPriorityStyles = (p) => {
    switch (p) {
      case 1: // HIGH
        return {
          border: 'border-red-500',
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
        };
      case 2: // MEDIUM
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
        };
      default: // LOW
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
        };
    }
  };

  const styles = getPriorityStyles(reminder.priority);

  return (
    <div className={`p-6 bg-white dark:bg-[#1f1f1f] rounded-2xl border-l-4 ${styles.border} shadow-sm flex items-center justify-between group transition-all hover:shadow-md`}>
      <div className="flex gap-4">
        <div className={`p-3 ${styles.bg} rounded-full ${styles.text}`}>
          <Bell size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100">{reminder.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">{reminder.description}</p>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${styles.badge}`}>
              <Clock size={12} /> Priority {reminder.priority}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Calendar size={12} /> {new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock size={12} /> {reminder.time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onDismiss(reminder.id)}
          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete Reminder"
        >
          <Trash2 size={18} />
        </button>
        <button 
          onClick={() => onDismiss(reminder.id)}
          className="text-sm font-semibold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};