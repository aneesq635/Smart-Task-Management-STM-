// /models/UserProfile.js

export const UserProfileSchema = {
  userId: "", // Links to Supabase UID

  // 1. BEHAVIORAL VECTORS (Scales of 1-5)
  // These are derived from the questionnaire and later updated by AI
  traits: {
    stressSensitivity: 3,    // 1: Calm under pressure, 5: Easily overwhelmed
    energyResilience: 3,     // 1: Fast burnout, 5: High stamina
    procrastinationPivot: 3, // 1: Disciplined, 5: Needs heavy encouragement
    socialBattery: 3,        // 1: Prefers isolation for tasks, 5: Collaborative
    cognitiveLoadPeak: 3     // 1: Prefers small tasks, 5: Prefers complex deep work
  },

  // 2. TEMPORAL PATTERNS
  // Helps AI decide WHEN to suggest specific task types
  patterns: {
    peakFocusTime: "morning", // morning, afternoon, evening, night
    energyBaseline: "medium", // low, medium, high
    breakFrequency: "medium", // low (long sessions), high (pomodoro style)
  },

  // 3. AI INTERACTION PREFERENCES
  // Controls the "Voice" of your system
  interaction: {
    preferredTone: "supportive", // supportive, direct, minimalist, analytical
    notificationIntensity: "gentle", // gentle (suggests), firm (reminds)
    aiInterventionLevel: 3       // 1: Only when asked, 5: Proactive suggestions
  },

  // 4. SYSTEM METADATA
  metadata: {
    lastOnboardingUpdate: null,
    onboardingVersion: "1.0",
    totalTasksCompleted: 0,
    averageMoodScore: 0,
    isInitialProfileSet: false
  }
};