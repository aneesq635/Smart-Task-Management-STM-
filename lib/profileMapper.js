export const mapOnboardingToProfile = (answers) => {
  // We initialize with neutral scores (3 is middle of 1-5)
  let traits = {
    stressSensitivity: 3,
    energyResilience: 3,
    procrastinationPivot: 3,
    cognitiveLoadPeak: 3
  };

  let patterns = {
    peakFocusTime: "morning",
    breakFrequency: "medium"
  };

  // Logic for Question 1 & 2 (Emotional Baseline)
  if (answers[1]?.includes("Overwhelmed")) traits.stressSensitivity = 5;
  if (answers[1]?.includes("Mostly positive")) traits.stressSensitivity = 2;
  
  if (answers[2]?.includes("Almost always")) traits.energyResilience = 1; // High stress = low resilience
  if (answers[2]?.includes("Rarely")) traits.energyResilience = 5;

  // Logic for Section 2 (Cognitive Style - Question 5/6)
  if (answers[5]?.includes("Deep Work")) traits.cognitiveLoadPeak = 5;
  if (answers[5]?.includes("Quick Wins")) traits.cognitiveLoadPeak = 2;

  // Logic for Temporal Patterns
  if (answers[5]?.includes("Night owl")) patterns.peakFocusTime = "night";
  if (answers[5]?.includes("Early bird")) patterns.peakFocusTime = "morning";

  return {
    traits,
    patterns,
    interaction: {
      preferredTone: traits.stressSensitivity >= 4 ? "supportive" : "direct",
      aiInterventionLevel: traits.stressSensitivity >= 4 ? 4 : 2
    }
  };
};