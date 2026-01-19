/**
 * Telemetry Utility
 * Logs behavioral events to the database without blocking the UI.
 */
export const logBehavior = (userId, eventType, eventValue = null, source = "dashboard") => {
  if (!userId) return;

  // We use a standard fetch but don't 'await' it. 
  // This is "Fire and Forget" so the user experience stays fast.
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      eventType,
      eventValue,
      source,
    }),
  }).catch((err) => {
    // We log to console for debugging, but the user will never see an error
    console.warn("Telemetry background sync skipped:", err);
  });
};