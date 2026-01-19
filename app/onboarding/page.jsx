"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../components/supabase";
import { useAuth } from "../components/AuthContext";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Moon,
  Sun,
  Loader2,
  Sparkles,
  Forward,
  FastForward
} from "lucide-react";

const questions = [
  // SECTION 1: Emotional Baseline
  {
    id: 1,
    section: "Emotional Baseline",
    description: "This helps us understand your emotional baseline.",
    question: "How would you describe your general mood these days?",
    options: ["😊 Mostly positive", "😐 Neutral or mixed", "😞 Often low", "😵 Overwhelmed"],
  },
  {
    id: 2,
    section: "Emotional Baseline",
    question: "How often do you feel mentally stressed?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    id: 3,
    section: "Emotional Baseline",
    question: "When you feel low, what usually helps the most?",
    options: ["Talking to someone", "Being alone", "Distracting myself", "I’m not sure"],
  },
  // SECTION 2: Cognitive Style
  {
    id: 4,
    section: "Cognitive Style",
    description: "Everyone processes things differently.",
    question: "How do you usually approach problems?",
    options: ["I plan carefully", "I act instinctively", "I overthink", "I avoid them"],
  },
  {
    id: 5,
    section: "Cognitive Style",
    question: "Do you prefer structure or flexibility?",
    options: ["Strong structure", "Some structure", "Flexible", "Completely spontaneous"],
  },
  {
    id: 6,
    section: "Cognitive Style",
    question: "How do handle decisions?",
    options: ["Confidently", "With hesitation", "With anxiety", "I avoid decisions"],
  },
  // SECTION 3: Daily Rhythm
  {
    id: 7,
    section: "Daily Rhythm",
    description: "Let’s understand when you function best.",
    question: "When do you usually feel most productive?",
    options: ["Morning", "Afternoon", "Night", "It varies"],
  },
  {
    id: 8,
    section: "Daily Rhythm",
    question: "How would you describe your daily routine?",
    options: ["Very consistent", "Somewhat consistent", "Very irregular"],
  },
  {
    id: 9,
    section: "Daily Rhythm",
    question: "How often do you feel mentally exhausted?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  // SECTION 4: Task Preferences
  {
    id: 10,
    section: "How you like to work",
    description: "This helps us shape tasks that feel manageable.",
    question: "How do you prefer tasks to be structured?",
    options: ["Small and simple", "Medium complexity", "Challenging tasks"],
  },
  {
    id: 11,
    section: "How you like to work",
    question: "What motivates you the most?",
    options: ["Completing tasks", "Seeing progress", "Encouragement", "Deadlines / pressure"],
  },
  {
    id: 12,
    section: "How you like to work",
    question: "How do unfinished tasks make you feel?",
    options: ["I revisit them later", "They stress me out", "I ignore them", "Depends on my mood"],
  },
  // SECTION 5: AI Style
  {
    id: 13,
    section: "AI Interaction Style",
    description: "You’re in control of how your AI behaves.",
    question: "How would you like the AI to interact with you?",
    options: ["Calm & gentle", "Friendly & motivational", "Direct & practical", "Adaptive based on mood"],
  },
  {
    id: 14,
    section: "AI Interaction Style",
    question: "When you’re feeling low, what should the AI do?",
    options: ["Comfort me", "Encourage action", "Just listen", "Ask thoughtful questions"],
  },
  {
    id: 15,
    section: "AI Interaction Style",
    question: "How often should the AI check in with you?",
    options: ["Only when I start it", "Once a day", "Multiple times a day", "Only when I seem off"],
  },
];

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState("intro"); // intro, questions, complete
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((p) => !p);
  };

  const handleOptionSelect = (option) => {
    const newAnswers = { ...answers, [questions[currentIdx].id]: option };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 300);
    } else {
      setTimeout(() => finalizeOnboarding(newAnswers), 300);
    }
  };

  const skipCurrentQuestion = () => {
    const newAnswers = { ...answers, [questions[currentIdx].id]: "Skipped" };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finalizeOnboarding(newAnswers);
    }
  };

  const skipRemainingAndSubmit = () => {
    const finalAnswers = { ...answers };
    
    questions.forEach((q) => {
      if (!finalAnswers[q.id]) {
        finalAnswers[q.id] = "Skipped";
      }
    });

    finalizeOnboarding(finalAnswers);
  };

  const handleSkipAll = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Supabase
      const { error } = await supabase.auth.updateUser({
        data: { has_completed_questionnaire: true }
      });
      if (error) throw error;

      // 2. Update MongoDB Profile (as skipped)
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          answers: { status: "skipped_entirely" },
        }),
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Error skipping onboarding:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeOnboarding = async (finalAnswers) => {
    setIsSubmitting(true);
    try {
      // 1. Update Supabase Metadata
      const { error: supabaseError } = await supabase.auth.updateUser({
        data: { 
          has_completed_questionnaire: true,
          onboarding_data: finalAnswers 
        }
      });
      if (supabaseError) throw supabaseError;

      // 2. Generate Personality Profile via our new API
      const profileResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          answers: finalAnswers,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to generate intelligence profile");
      }

      setStep("complete");
    } catch (err) {
      console.error("Error saving onboarding:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Brain className="animate-pulse text-indigo-600 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">MindSync</span>
        </div>
        <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {isDark ? <Sun className="text-yellow-400 w-5 h-5" /> : <Moon className="text-slate-500 w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {step === "intro" && (
          <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Let’s get to know you</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                This helps your AI understand how to support you — in a way that feels right for you.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-4 text-left inline-block w-full">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-500 w-5 h-5" /> Takes about 3–5 minutes</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-500 w-5 h-5" /> No right or wrong answers</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-500 w-5 h-5" /> You can update this later anytime</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setStep("questions")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-16 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                Start Questionnaire
              </button>
              <button 
                onClick={handleSkipAll}
                className="text-slate-500 font-medium hover:underline p-2"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === "questions" && (
          <div className="max-w-2xl w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                <span>Step {currentIdx + 1} of {questions.length}</span>
                <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-tighter">
                  {questions[currentIdx].section}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {questions[currentIdx].question}
                </h2>
                {questions[currentIdx].description && (
                  <p className="text-slate-500 dark:text-slate-400">{questions[currentIdx].description}</p>
                )}
              </div>

              <div className="grid gap-3">
                {questions[currentIdx].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className="w-full text-left p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/10 dark:hover:bg-slate-800 transition-all group"
                  >
                    <span className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {opt}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-0 transition-all font-medium"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                
                <div className="flex items-center gap-5">
                  <button 
                    onClick={skipCurrentQuestion}
                    className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm"
                  >
                    Skip <Forward className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={skipRemainingAndSubmit}
                    className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm"
                  >
                    Skip remaining <FastForward className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={handleSkipAll}
                    className="text-slate-300 hover:text-red-400 font-medium text-xs uppercase tracking-widest transition-colors"
                  >
                    Skip All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight">You’re all set</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                Your AI will start adapting to you from now on.
              </p>
              <p className="text-sm text-slate-400">You can update your preferences anytime from settings.</p>
            </div>
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="font-bold text-lg text-slate-900 dark:text-white">Finishing setup...</p>
        </div>
      )}
    </div>
  );
}