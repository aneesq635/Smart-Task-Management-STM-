"use client";

import Header from "./components/Header";
import AuthCard from "./components/AuthCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <Header hideAuthButtons={true} />

      {/* Main Section: Responsive flex-col on mobile, flex-row on laptop */}
      <main className="flex flex-col lg:flex-row items-start justify-center px-6 lg:px-24 py-16 lg:py-24 gap-12 lg:gap-24">

        {/* Left Side: Intro + CTA (Text only, no containers) */}
        <div className="flex-1 flex flex-col gap-16">
          
          {/* Intro Section - No background box */}
          <div className="w-full">
            <p className="text-indigo-600 font-bold text-xs tracking-[0.2em] uppercase mb-4">
              AI-Powered Productivity
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Your Personal AI Companion for <span className="text-indigo-600">Productivity</span> and Well-Being
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl">
              Meet the AI that **understands your rhythm**. Track habits, plan your day, and get gentle, supportive guidance whenever you need it. Whether you want to boost consistency or talk through a tough day, your companion is always ready.
            </p>

            {/* Key Highlights: Organized with headings but no boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Smart Task Planning
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Tailored to your routine. The AI learns when you are most productive and **adjusts your schedule** accordingly.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Emotional Intelligence
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Real-time **emotional support**. Get motivation and guidance that adapts to your current mood and behavior.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Contextual Reminders
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Smart nudges that **adjust to your energy levels**, ensuring you stay on track without feeling overwhelmed.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Adaptive Learning
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Continuous growth. The more you interact, the more your companion **understands your unique needs**.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section - No background box */}
          <div className="w-full pt-10 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Start Your Personalized Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-xl">
              Experience an AI ecosystem that grows with you. **No credit card required.** Join our community today.
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-xl shadow-indigo-200 dark:shadow-none"
            >
              Start Your Journey Free
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side: AuthCard Area */}
        <div className="flex-1 w-full max-w-md lg:sticky lg:top-24">
          <AuthCard />
        </div>

      </main>
    </div>
  );
}

