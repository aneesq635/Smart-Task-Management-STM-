import React from 'react';
import { 
  Sun, 
  ListTodo, 
  BarChart3, 
  History, 
  Sparkles, 
  Bell, 
  Calendar,
  LogOut
} from 'lucide-react';

const ViewType = {
  TODAY: 'TODAY',
  DAILY: 'DAILY',
  ANALYTICS: 'ANALYTICS',
  HISTORY: 'HISTORY',
  AI_FEEDBACK: 'AI_FEEDBACK',
  REMINDERS: 'REMINDERS',
  CALENDAR: 'CALENDAR'
};

export const Sidebar = ({ activeView, onViewChange, isOpen }) => {
  const topNavItems = [
    { id: ViewType.TODAY, label: 'Today Tasks', icon: <Sun size={20} /> },
    { id: ViewType.DAILY, label: 'Daily Tasks', icon: <ListTodo size={20} /> },
    { id: ViewType.ANALYTICS, label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: ViewType.HISTORY, label: 'Task History', icon: <History size={20} /> },
    { id: ViewType.AI_FEEDBACK, label: 'AI Feedback', icon: <Sparkles size={20} /> },
  ];

  const bottomNavItems = [
    { id: ViewType.REMINDERS, label: 'Reminders', icon: <Bell size={20} /> },
    { id: ViewType.CALENDAR, label: 'Calendar', icon: <Calendar size={20} /> },
  ];

  const renderNavItem = (item) => {
    const isActive = activeView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onViewChange(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
        }`}
      >
        <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
          {item.icon}
        </span>
        <span className="text-sm font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <aside 
      className={`
        fixed lg:relative z-50 h-full w-72 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-zinc-800
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Brand Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <ListTodo size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">STM</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {topNavItems.map(renderNavItem)}
        
        <div className="my-6 border-t border-gray-100 dark:border-zinc-800 pt-6">
          <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Planning</p>
          {bottomNavItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Footer Profile Section */}
      <div className="p-4 mt-auto border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
          <img 
            src="https://picsum.photos/seed/user1/40/40" 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">Alex Johnson</p>
            <p className="text-xs text-gray-500 truncate">Pro Account</p>
          </div>
          <LogOut size={16} className="text-gray-400 hover:text-red-500" />
        </div>
      </div>
    </aside>
  );
};