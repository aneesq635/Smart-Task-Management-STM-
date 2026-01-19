export const logEvent = (userId, type, value = null, source = "dashboard") => {
  if (!userId) return;

  // Use navigator.sendBeacon for "fire and forget" or standard fetch
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      eventType: type,
      eventValue: value,
      source
    }),
  }).catch(err => console.error("Telemetry failed", err));
};