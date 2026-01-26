import React from "react";
import {
  Brain,
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell
} from "lucide-react";

export const Sidebar = ({ activeView, onViewChange, isOpen }) => {
  const SidebarItem = ({ icon, label, view }) => {
    const isActive = activeView === view;

    return (
      <button
        onClick={() => onViewChange(view)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
          ${
            isActive
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }
        `}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <aside
      className={`
        fixed lg:relative z-50 top-0 left-0 h-full w-64
        bg-white dark:bg-slate-950
        border-r border-slate-200 dark:border-slate-800
        p-6 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Brain className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-slate-900 dark:text-white">
          MindSync
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        <SidebarItem
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          view="DASHBOARD"
        />
        <SidebarItem
          icon={<CalendarCheck className="w-5 h-5" />}
          label="Today’s Plan"
          view="TODAY"
        />
        <SidebarItem
          icon={<MessageSquare className="w-5 h-5" />}
          label="Talk to AI"
          view="AI_CHAT"
        />
        <SidebarItem
          icon={<BarChart3 className="w-5 h-5" />}
          label="Insights"
          view="INSIGHTS"
        />
        <SidebarItem
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          view="SETTINGS"
        />
      </nav>

       <SidebarItem
          icon={<Bell className="w-5 h-5" />}
          label="Remainders"
          view="REMAINDERS"
        />

      {/* Logout */}
      <button
        className="flex items-center gap-3 px-4 py-3 mt-6
        text-slate-500 hover:text-red-600
        rounded-xl transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
};
