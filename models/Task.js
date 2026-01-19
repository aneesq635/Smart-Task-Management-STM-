// /models/Task.js

export const TaskSchema = {
  // Identification
  userId: "",          // Linked to Supabase User ID
  title: "",           // Name of the task
  description: "",     // Optional details

  // Psychology-Aware Metadata (The "Brain" of the task)
  energyLevel: {
    type: String,
    enum: ["Low", "Medium", "High"], 
    default: "Medium"
  },
  complexity: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  psychologicalTag: {
    type: String,
    enum: ["Deep Work", "Quick Win", "Administrative", "Creative"],
    default: "Quick Win"
  },

  // State Management
  status: {
    type: String,
    enum: ["Pending", "In-Progress", "Completed", "Snoozed"],
    default: "Pending"
  },

  // Timeline
  createdAt: null,
  completedAt: null,
  dueDate: null,
  
  // AI Tracking
  snoozeCount: 0,      // Tracks procrastination patterns
  aiSuggested: false   // True if the AI was the one who generated/chunked this task
};

/**
 * Helper function to validate a task object before sending to MongoDB
 */
export const validateTask = (task) => {
  const errors = [];
  if (!task.title) errors.push("Title is required");
  if (!task.userId) errors.push("User ID is required");
  if (!["Low", "Medium", "High"].includes(task.energyLevel)) {
    errors.push("Invalid energy level");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};