import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Loader2,
  Sparkles,
  Bell,
} from "lucide-react";
import { ReminderCard } from "./ReminderCard";
import { AddReminderModal } from "./AddReminderModel";
import { useAuth } from "../AuthContext";
import { useReminderNotifications } from "@/hooks/useReminderNotifications";
import { requestNotificationPermission } from "@/utils/notificationManager";
import { registerServiceWorker } from "@/utils/serviceWorkerRegistration";

export const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Enable notifications hook
  useReminderNotifications(reminders);

  useEffect(() => {
    // Register service worker and request notification permission
    const initNotifications = async () => {
      await registerServiceWorker();
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };

    initNotifications();
  }, []);

  const loadReminders = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Loading reminders for user:", user);
      const response = await fetch(`/api/reminders/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }
      const data = (await response.json()) || [];
      // Sort: Priority 1 first, then by date/time
      const sorted = [...data].sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return (
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
        );
      });
      setReminders(sorted);
    } catch (error) {
      console.error("Failed to load reminders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleAddReminder = async (newReminderData) => {
    const reminder = {
      ...newReminderData,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: Date.now(),
    };
    try {
      const response = await fetch("/api/reminders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reminder),
      });

      if (!response.ok) {
        throw new Error("Failed to save reminder");
      }
      console.log("Saving reminder:", reminder);
      loadReminders();

      return await response.json();
    } catch (error) {
      console.error("Save reminder error:", error);
      throw error;
    }
  };

  const handleDismissReminder = async (id) => {
    try {
      console.log("Deleting reminder with id:", id);
      const response = await fetch(`/api/reminders/delete?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReminders((prev) => prev.filter((r) => r.id !== id));
      }
      if (!response.ok) {
        throw new Error("Failed to delete reminder");
      }

      return await response.json();
    } catch (error) {
      console.error("Delete reminder error:", error);
      throw error;
    }
  };
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (!granted) {
      alert(
        "Please enable notifications in your browser settings to receive reminders.",
      );
    }
  };

  const filteredReminders = reminders.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
     {!notificationsEnabled && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-yellow-600" size={20} />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Enable notifications to receive reminders even when this page is closed
              </span>
            </div>
            <button
              onClick={handleEnableNotifications}
              className="text-sm font-bold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Enable Now
            </button>
          </div>
        </div>
      )}
      {/* Header - Full Width */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Reminders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Manage your daily tasks and critical deadlines.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>Create Reminder</span>
        </button>
      </header>

      {/* Quick AI Suggestion Bar - In Container */}
      <div className="mb-8 p-4 bg-white dark:bg-[#1f1f1f] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 shadow-sm">
            <Sparkles size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Need help organizing? Use our AI Assistant to quickly add tasks.
          </span>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:underline whitespace-nowrap"
        >
          Try it now
        </button>
      </div>

      {/* Search & Stats - Full Width */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
              Active
            </span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-500">
              {reminders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Syncing with your workspace...
          </p>
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4">
            <Bell size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            All caught up!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
            You don't have any reminders matching your search or pending in your
            list.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 text-blue-600 dark:text-blue-500 font-bold hover:underline"
          >
            Add your first reminder
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onDismiss={handleDismissReminder}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed right-6 bottom-6 w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform active:scale-90 z-50"
      >
        <Plus size={32} />
      </button>

      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddReminder}
      />
    </>
  );
};
