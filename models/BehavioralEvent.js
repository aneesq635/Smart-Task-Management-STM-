/**
 * BehavioralEvent Schema & Validation
 * Ensures that every log entry follows a strict format for the AI to read later.
 */

export const EventTypes = {
  AUTH_LOGIN: "auth_login",
  TASK_CREATE: "task_create",
  TASK_COMPLETE: "task_complete",
  TASK_SNOOZE: "task_snooze",
  MOOD_CHECK: "mood_check",
  UI_TOGGLE: "ui_toggle",
  SESSION_START: "session_start",
  AI_INTERACT: "ai_interact"
};

export const validateEvent = (event) => {
  const errors = [];
  
  if (!event.userId) errors.push("User ID is required");
  
  // Checks if the eventType sent exists in our EventTypes list
  const validTypes = Object.values(EventTypes);
  if (!event.eventType || !validTypes.includes(event.eventType)) {
    errors.push(`Invalid or missing event type: ${event.eventType}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};