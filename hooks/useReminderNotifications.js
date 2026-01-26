import { useEffect, useRef } from 'react';
import { showNotification, requestNotificationPermission } from '../utils/notificationManager';

export function useReminderNotifications(reminders) {
  const checkedReminders = useRef(new Set());
  const intervalRef = useRef(null);
  const scheduledTimeouts = useRef(new Map());

  useEffect(() => {
    // Request permission on mount
    requestNotificationPermission();

    // Check reminders every 30 seconds for any missed ones
    intervalRef.current = setInterval(() => {
      checkReminders();
    }, 30000);

    // Schedule exact time notifications for all reminders
    scheduleAllReminders();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Clear all scheduled timeouts
      scheduledTimeouts.current.forEach(timeout => clearTimeout(timeout));
      scheduledTimeouts.current.clear();
    };
  }, [reminders]);

  const scheduleAllReminders = () => {
    // Clear existing timeouts
    scheduledTimeouts.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeouts.current.clear();

    const now = new Date();
    
    reminders.forEach(reminder => {
      // Skip if already notified
      if (checkedReminders.current.has(reminder.id)) {
        return;
      }

      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      const timeDiff = reminderDateTime - now;
      
      // Only schedule future reminders (not past ones)
      if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) { // Within 24 hours
        const timeoutId = setTimeout(() => {
          triggerNotification(reminder);
        }, timeDiff);
        
        scheduledTimeouts.current.set(reminder.id, timeoutId);
        console.log(`Scheduled notification for "${reminder.title}" in ${Math.round(timeDiff / 1000)} seconds`);
      }
    });
  };

  const checkReminders = () => {
    const now = new Date();
    
    reminders.forEach(reminder => {
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      const timeDiff = reminderDateTime - now;
      
      // Check if reminder time has passed or is within 1 minute
      // and hasn't been notified yet
      if (timeDiff <= 60000 && timeDiff > -60000 && !checkedReminders.current.has(reminder.id)) {
        triggerNotification(reminder);
      }
    });
  };

  const triggerNotification = (reminder) => {
    // Mark as notified
    checkedReminders.current.add(reminder.id);
    
    // Show notification
    showNotification(
      reminder.title,
      `${reminder.description || 'Reminder due now!'}\nPriority: P${reminder.priority}`,
      '/bell-icon.png'
    );
    
    console.log('Notification triggered for:', reminder.title);
  };

  return null;
}