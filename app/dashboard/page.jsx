"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";
import supabase from "../components/supabase";
import { logBehavior } from "@/lib/telemetry.js";
import {
  Brain,
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  Smile,
  Meh,
  Frown,
  X,
  Plus,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Trash2,
  Edit3,
  Check,
  Clock,
  PlayCircle,
  RotateCcw,
  Trophy,
  AlertCircle,
  Timer,
  PauseCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("User");
  const [isDark, setIsDark] = useState(false);
  const [mood, setMood] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good evening");

  /* --- DATA STATES --- */
  const [tasks, setTasks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  /* --- NEW TASK RATING STATES --- */
  const [taskDifficulty, setTaskDifficulty] = useState(2); 
  const [taskEstimateMinutes, setTaskEstimateMinutes] = useState(15); 
  const [taskPriority, setTaskPriority] = useState("Medium");

  /* --- SNOOZE & FOCUS STATES --- */
  const [snoozingTask, setSnoozingTask] = useState(null);
  const [focusTask, setFocusTask] = useState(null);
  const [showFocusFeedback, setShowFocusFeedback] = useState(false);

  /* --- HYBRID INTELLIGENCE LOGIC --- */
  const isGenerallySensitive = userProfile?.traits?.stressSensitivity > 3;
  const isFeelingLow = mood === "low";
  const activeTasks = tasks.filter((t) => t.status !== "Completed");
  const isOverloaded = activeTasks.length >= 5;

  const shouldActivateSupport = isFeelingLow || (isGenerallySensitive && mood !== "good") || isOverloaded;

  /* --- NEW CATEGORIZATION LOGIC WITH PRIORITY SORTING --- */
  const getCategorizedTasks = () => {
    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    
    const sortTasks = (taskList) => {
      return [...taskList].sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    };

    const categories = {
      high: sortTasks(tasks.filter(t => t.status !== "Completed" && t.energyLevel === "High")),
      medium: sortTasks(tasks.filter(t => t.status !== "Completed" && t.energyLevel === "Medium")),
      low: sortTasks(tasks.filter(t => t.status !== "Completed" && t.energyLevel === "Low")),
      completed: tasks.filter(t => t.status === "Completed")
    };
    return categories;
  };

  const categorized = getCategorizedTasks();

  /* --- DYNAMIC BACKGROUND LOGIC --- */
  const getBackgroundGlow = () => {
    if (mood === "okay") return "after:bg-blue-400/10";
    if (mood === "good") return "after:bg-amber-400/10";
    if (mood === "low") return "after:bg-indigo-600/15";
    return "";
  };

  /* --- REFINED AI SMART SUGGESTIONS (MOMENTUM LOGIC) --- */
  const getSmartSuggestion = () => {
    if (!mood || activeTasks.length === 0) return null;

    if (mood === "good") {
      const bestTask = activeTasks.find(t => t.priority === "High" && t.energyLevel === "High") ||
                       activeTasks.find(t => t.energyLevel === "High");
      
      if (bestTask) return `I see you're feeling 'Good'—maybe it's a great time to tackle that High Energy task: "${bestTask.title}"?`;
    } 
    
    if (mood === "low") {
      const easyTask = activeTasks.find(t => t.energyLevel === "Low") || 
                       activeTasks.find(t => t.estimateMinutes <= 15);
      
      if (easyTask) return `Since you're feeling a bit low, let's build some momentum with a quick win: "${easyTask.title}"?`;
    }

    return null;
  };

  const aiSuggestion = getSmartSuggestion();

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };
    updateGreeting();
  }, []);

  useEffect(() => {
    const protect = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/");
        return;
      }
      if (!data.user.user_metadata?.has_completed_questionnaire) {
        router.replace("/onboarding");
      } else {
        logBehavior(data.user.id, "session_start", "dashboard_load");
      }
    };
    protect();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/");
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setDataLoading(true);
      const [taskRes, profileRes] = await Promise.all([
        fetch(`/api/tasks?userId=${user.id}`),
        fetch(`/api/profile?userId=${user.id}`)
      ]);
      if (taskRes.ok) setTasks(await taskRes.json());
      if (profileRes.ok) setUserProfile(await profileRes.json());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
    if (user) {
      setFirstName(user.user_metadata?.first_name || "User");
      fetchData();
    }
  }, [user, loading, router, fetchData]);

  const handleMoodSelect = async (selectedMood) => {
    setMood(selectedMood);
    logBehavior(user.id, "mood_check", selectedMood);
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, mood: selectedMood, note: "Dashboard Quick-check" }),
      });
    } catch (e) {
      console.error("Mood sync failed", e);
    }
  };

  const handleAddTask = async (e, customTitle = null) => {
    if (e) e.preventDefault();
    const title = customTitle || newTaskTitle;
    if (!title.trim()) return;

    // Categorization logic updated: If difficulty is 4 or 5, it goes to High Energy (Deep Work)
    let energyLevel = "Medium";
    let psychologicalTag = "Quick Win";

    if (taskDifficulty >= 4) {
      energyLevel = "High";
      psychologicalTag = "Deep Focus";
    } else if (taskDifficulty <= 2 && taskEstimateMinutes <= 15) {
      energyLevel = "Low";
      psychologicalTag = "Easy Start";
    }

    if (shouldActivateSupport) psychologicalTag = "Micro-step";

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: title,
          energyLevel: energyLevel,
          complexity: taskDifficulty,
          priority: taskPriority,
          psychologicalTag: psychologicalTag,
          estimateMinutes: taskEstimateMinutes,
          secondsLeft: taskEstimateMinutes * 60,
          isPaused: true,
          status: "Pending"
        }),
      });

      if (res.ok) {
        logBehavior(user.id, "task_create", { difficulty: taskDifficulty, estimate: taskEstimateMinutes, priority: taskPriority });
        setNewTaskTitle("");
        setTaskDifficulty(2);
        setTaskEstimateMinutes(15);
        setTaskPriority("Medium");
        setShowAddTask(false);
        fetchData(); 
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updates } : t));
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) logBehavior(user.id, "task_update", taskId);
      else fetchData();
    } catch (error) {
      console.error("Network error during update:", error);
      fetchData();
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) fetchData();
    } catch (error) {
      fetchData();
    }
  };

  const handleSnoozeTask = (task) => setSnoozingTask(task);

  const confirmSnooze = async (reason, durationMinutes) => {
    if (!snoozingTask) return;
    const newCount = (snoozingTask.snoozeCount || 0) + 1;
    const snoozeSeconds = durationMinutes * 60;
    
    handleUpdateTask(snoozingTask._id, { 
      snoozeCount: newCount, 
      status: "Snoozed",
      lastSnoozeReason: reason,
      snoozedAt: new Date().toISOString(),
      snoozeSecondsLeft: snoozeSeconds,
      isPaused: false
    });
    logBehavior(user.id, "task_snooze_detailed", { taskId: snoozingTask._id, reason, duration: durationMinutes });
    setSnoozingTask(null);
  };

  const onTimerEnd = (taskId) => {
    handleUpdateTask(taskId, { status: "Completed", isPaused: true });
    setFocusTask(null);
    setShowFocusFeedback(true);
  };

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
    if (user) logBehavior(user.id, "ui_toggle", isDark ? "light_mode" : "dark_mode");
  };

  const handleLogout = async () => {
    if (user) logBehavior(user.id, "auth_logout");
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Brain className="w-10 h-10 animate-pulse text-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-x-hidden after:content-[''] after:fixed after:top-[-10%] after:right-[-10%] after:w-[50%] after:h-[50%] after:rounded-full after:blur-[120px] after:z-0 after:transition-all after:duration-1000 ${getBackgroundGlow()}`}>
      <aside className="w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:flex flex-col z-30">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">MindSync</span>
        </div>
        <nav className="space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
          <SidebarItem icon={<CalendarCheck />} label="Today’s Plan" />
          <SidebarItem 
            icon={<MessageSquare />} 
            label="Talk to AI" 
            onClick={() => { setAiOpen(true); logBehavior(user.id, "ai_interact", "sidebar_open"); }} 
          />
          <SidebarItem icon={<BarChart3 />} label="Insights" disabled />
          <SidebarItem icon={<Settings />} label="Settings" />
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      <main className="flex-1 ml-0 lg:ml-64 flex flex-col relative z-10">
        <header className="h-20 fixed top-0 left-0 right-0 lg:left-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {shouldActivateSupport ? "Take it easy, " : `${greeting}, `}{firstName}
            </h1>
            <p className="text-sm text-slate-500">
              {isFeelingLow ? "I'm here to support you. Let's keep things very simple." : 
               isOverloaded ? "You've got a lot on your plate. Focus on one small win." :
               "Let’s keep today light and manageable."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
            </button>
            <User className="w-10 h-10 text-slate-400" />
          </div>
        </header>

        <section className="pt-24 px-8 space-y-10 overflow-y-auto flex-1 pb-10">
          {aiSuggestion && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center text-amber-600">
                <Brain size={20} />
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">{aiSuggestion}</p>
            </div>
          )}

          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">Today's Focus</h2>
              <p className="text-slate-500 text-sm">{activeTasks.length} active items</p>
            </div>
            <button onClick={() => setShowAddTask(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
              <Plus size={18} /> Add Task
            </button>
          </div>

          {showAddTask && (
            <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-indigo-500 shadow-xl animate-in zoom-in-95 space-y-4">
              <input
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-y border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Difficulty (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTaskDifficulty(num)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${taskDifficulty === num ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Task Limit (Minutes)</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="number"
                      value={taskEstimateMinutes}
                      onChange={(e) => setTaskEstimateMinutes(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {[15, 30, 45, 60, 90].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setTaskEstimateMinutes(m)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${taskEstimateMinutes === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Priority</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskPriority(p)}
                        className={`px-3 h-8 rounded-lg text-[10px] font-bold transition-all ${taskPriority === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={12} /> AI Strategy Applied
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddTask(false)} className="px-3 py-1 text-sm text-slate-500">Cancel</button>
                  <button type="submit" className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Create Task</button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-12">
            <TaskSection title="Deep Work" subtitle="High Energy" tasks={categorized.high} handleUpdateTask={handleUpdateTask} handleDeleteTask={handleDeleteTask} handleSnoozeTask={handleSnoozeTask} setFocusTask={setFocusTask} onTimerEnd={onTimerEnd} />
            <TaskSection title="Maintenance" subtitle="Medium Energy" tasks={categorized.medium} handleUpdateTask={handleUpdateTask} handleDeleteTask={handleDeleteTask} handleSnoozeTask={handleSnoozeTask} setFocusTask={setFocusTask} onTimerEnd={onTimerEnd} />
            <TaskSection title="Quick Wins" subtitle="Low Energy" tasks={categorized.low} handleUpdateTask={handleUpdateTask} handleDeleteTask={handleDeleteTask} handleSnoozeTask={handleSnoozeTask} setFocusTask={setFocusTask} onTimerEnd={onTimerEnd} />
            
            {categorized.completed.length > 0 && (
              <TaskSection title="Done" subtitle="Completed" tasks={categorized.completed} handleUpdateTask={handleUpdateTask} handleDeleteTask={handleDeleteTask} handleSnoozeTask={handleSnoozeTask} setFocusTask={setFocusTask} onTimerEnd={onTimerEnd} />
            )}
          </div>

          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
            <h2 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">How are you feeling right now?</h2>
            <div className="flex justify-center gap-8">
              <MoodIcon icon={<Smile />} active={mood === "good"} label="Good" onClick={() => handleMoodSelect("good")} />
              <MoodIcon icon={<Meh />} active={mood === "okay"} label="Okay" onClick={() => handleMoodSelect("okay")} />
              <MoodIcon icon={<Frown />} active={mood === "low"} label="Low" onClick={() => handleMoodSelect("low")} />
            </div>
          </div>
        </section>
      </main>

      <button onClick={() => setAiOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] transition-all z-40 group">
        <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 group-hover:opacity-40"></div>
        <MessageSquare size={24} className="relative z-10" />
      </button>

      {snoozingTask && <SnoozeReflectModal task={snoozingTask} onClose={() => setSnoozingTask(null)} onConfirm={confirmSnooze} />}
      
      {focusTask && (
        <FocusSessionSetupModal 
          task={focusTask} 
          onClose={() => setFocusTask(null)} 
          onUpdateTask={(updates) => handleUpdateTask(focusTask._id, updates)}
        />
      )}

      {showFocusFeedback && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl max-w-sm w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
             <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Brain size={32} />
             </div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Great job on that stretch!</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-6">How are you feeling now?</p>
             <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => { handleMoodSelect("good"); setShowFocusFeedback(false); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 transition-colors"><Smile className="text-amber-500" /></button>
                <button onClick={() => { handleMoodSelect("okay"); setShowFocusFeedback(false); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 transition-colors"><Meh className="text-blue-500" /></button>
                <button onClick={() => { handleMoodSelect("low"); setShowFocusFeedback(false); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 transition-colors"><Frown className="text-indigo-500" /></button>
             </div>
             <button onClick={() => setShowFocusFeedback(false)} className="text-slate-400 text-sm font-medium hover:text-slate-600">Dismiss</button>
          </div>
        </div>
      )}

      {aiOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full sm:w-96 bg-white dark:bg-slate-950 h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="font-bold text-slate-900 dark:text-white">Your AI Companion</div>
              <button onClick={() => setAiOpen(false)} className="text-slate-500 hover:text-slate-700"><X /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-500">
                {shouldActivateSupport ? "I've noticed you might be feeling a bit under pressure. I'm here to help you simplify things." : "I’m here to listen. 💬"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const TaskSection = ({ title, subtitle, tasks, handleUpdateTask, handleDeleteTask, handleSnoozeTask, setFocusTask, onTimerEnd }) => (
  <div className="space-y-4">
    <div className="flex items-baseline gap-2">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{title}</h3>
      <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">— {subtitle}</span>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <FocusCard
            key={task._id}
            task={task}
            onUpdate={(updates) => handleUpdateTask(task._id, updates)}
            onDelete={() => handleDeleteTask(task._id)}
            onSnooze={() => handleSnoozeTask(task)}
            onOpenTimer={() => setFocusTask(task)}
            onTimerEnd={() => onTimerEnd(task._id)}
          />
        ))
      ) : (
        <div className="col-span-1 py-4 px-6 border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-2xl flex items-center justify-center">
          <p className="text-[10px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-tighter">Empty Slot</p>
        </div>
      )}
    </div>
  </div>
);

const SidebarItem = ({ icon, label, active, disabled, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-bold" : disabled ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"}`}>
    {React.cloneElement(icon, { size: 20 })}
    {label}
  </div>
);

const MoodIcon = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 group transition-all ${active ? "scale-110" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"}`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50"}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className={`text-xs font-bold ${active ? "text-indigo-600" : "text-slate-400"}`}>{label}</span>
  </button>
);

const FocusCard = ({ task, onUpdate, onDelete, onSnooze, onOpenTimer, onTimerEnd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editMinutes, setEditMinutes] = useState(task.estimateMinutes || 15);
  
  const isCompleted = task.status === "Completed";
  const isInProgress = task.status === "In Progress";
  const isSnoozed = task.status === "Snoozed";
  const isPaused = task.isPaused;
  const isOvertime = task.secondsLeft <= 0;
  const isSnoozeFinished = isSnoozed && task.snoozeSecondsLeft <= 0;

  const handleSave = () => { 
    onUpdate({ title: editTitle, estimateMinutes: editMinutes, secondsLeft: editMinutes * 60 }); 
    setIsEditing(false); 
  };

  useEffect(() => {
    let interval = null;
    if (isInProgress && !isPaused) {
      interval = setInterval(() => {
        onUpdate({ secondsLeft: task.secondsLeft - 1 });
      }, 1000);
    }
    if (isSnoozed && !isPaused && task.snoozeSecondsLeft > 0) {
      interval = setInterval(() => {
        onUpdate({ snoozeSecondsLeft: task.snoozeSecondsLeft - 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInProgress, isSnoozed, isPaused, task.secondsLeft, task.snoozeSecondsLeft]);

  const formatTime = (s) => {
    const absS = Math.abs(s);
    const m = Math.floor(absS / 60);
    const rs = absS % 60;
    return `${s < 0 ? '-' : ''}${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  return (
    <div className={`bg-white dark:bg-slate-950 p-5 rounded-2xl border transition-all shadow-sm group relative ${isCompleted ? 'opacity-60 border-slate-100 dark:border-slate-800' : isInProgress ? 'border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-indigo-100/50 bg-indigo-50/30 dark:bg-indigo-900/10' : isSnoozed ? 'bg-amber-50/20 border-amber-200 shadow-lg shadow-amber-50 dark:border-amber-800 dark:bg-amber-950/20' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-500/50'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold  ${task.energyLevel === "Low" ? "bg-green-100 text-green-600" : task.energyLevel === "High" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                {task.energyLevel} Energy
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${task.priority === "High" ? "bg-red-500 text-white" : task.priority === "Medium" ? "bg-amber-100 text-amber-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {task.priority} Priority
            </span>
            <span 
              onClick={() => { if(!isCompleted && !isSnoozed) setIsEditing(true); }}
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-colors ${task.hasLimitRealityCheck ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100'} ${isSnoozed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              Limit: {task.estimateMinutes || 15}m
              {task.hasLimitRealityCheck && <AlertCircle size={8} />}
            </span>
            {isSnoozed && (
                <div className={`flex items-center gap-1.5 ${isSnoozeFinished ? 'animate-bounce' : ''}`}>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${isSnoozeFinished ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {isSnoozeFinished ? 'Wake Up!' : 'Snoozed'}
                    </span>
                    {!isSnoozeFinished && (
                      <span className="text-[10px] font-black tabular-nums text-amber-600 flex items-center gap-1">
                          <Timer size={10}/> {formatTime(task.snoozeSecondsLeft)}
                      </span>
                    )}
                </div>
            )}
            {isInProgress && (
                <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${isPaused ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white animate-pulse'}`}>
                      {isPaused ? 'Paused' : 'Live'}
                    </span>
                    <span className={`text-[10px] font-black tabular-nums bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 ${isOvertime ? 'text-red-500' : isPaused ? 'text-amber-500' : 'text-indigo-600'}`}>
                        <Timer size={10}/> {formatTime(task.secondsLeft)}
                    </span>
                </div>
            )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && !isSnoozed && (
            <>
              <button onClick={onSnooze} className="text-slate-400 hover:text-amber-500"><Clock size={14} /></button>
              <button onClick={() => setIsEditing(!isEditing)} className="text-slate-400 hover:text-indigo-600"><Edit3 size={14}/></button>
            </>
          )}
          <button onClick={onDelete} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <input 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
            className="w-full bg-white dark:bg-slate-800 dark:text-white rounded-lg px-2 py-1.5 text-sm outline-none border border-indigo-500" 
            autoFocus 
          />
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Limit (m):</label>
            <input 
              type="number"
              value={editMinutes} 
              onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)} 
              className="w-16 bg-white dark:bg-slate-800 dark:text-white rounded-lg px-2 py-1 text-sm outline-none border border-indigo-500" 
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
            <button onClick={handleSave} className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg">Save</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className={`font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 ${isCompleted ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
          
          <div className="flex gap-2">
            {isSnoozed ? (
              <button 
                onClick={() => onUpdate({ status: "Pending", snoozeSecondsLeft: 0, isPaused: true })} 
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100"
              >
                End Snooze & Unlock
              </button>
            ) : isInProgress ? (
              <button onClick={() => onUpdate({ isPaused: !isPaused })} className={`flex-1 ${isPaused ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} py-2 rounded-xl text-xs font-bold transition-colors`}>
                {isPaused ? "Resume Session" : "Pause Focus"}
              </button>
            ) : !isCompleted && (
              <button onClick={onOpenTimer} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">Start Focus</button>
            )}
            
            {!isCompleted && !isSnoozed && (
              <button onClick={() => onUpdate({ status: "Completed", isPaused: true })} className="w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-green-500 hover:border-green-500 transition-all"><Check size={18}/></button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FocusSessionSetupModal = ({ task, onClose, onUpdateTask }) => {
  const [mins, setMins] = useState(task.estimateMinutes || 15);
  const exceedsLimit = mins > (task.estimateMinutes || 0);
  const presets = [5, 10, 15, 30, 45, 60, 90];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-950 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-white/20">
        <div className="p-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <Timer size={24} />
          </div>
          <h2 className="text-2xl font-black mb-1 dark:text-white tracking-tight">Focus Duration</h2>
          <p className="text-slate-500 text-sm mb-6">Set your target for this stretch.</p>
          
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
            <input 
              type="number" 
              value={mins} 
              onChange={(e) => setMins(parseInt(e.target.value) || 0)} 
              className="w-full text-4xl font-black text-indigo-600 bg-transparent outline-none dark:text-indigo-400" 
            />
            <span className="text-xl font-bold text-slate-300">min</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {presets.map(p => (
              <button 
                key={p} 
                onClick={() => setMins(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mins === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
              >
                {p}m
              </button>
            ))}
          </div>

          {exceedsLimit && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-orange-500 shrink-0" size={18} />
              <p className="text-[11px] font-medium text-orange-800 dark:text-orange-200">
                This exceeds your original estimate of {task.estimateMinutes}m. Starting will update the task limit permanently.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 flex flex-col gap-2">
            <button 
              onClick={() => { 
                onUpdateTask({ estimateMinutes: mins, secondsLeft: mins * 60, status: "In Progress", isPaused: false, hasLimitRealityCheck: exceedsLimit }); 
                onClose(); 
              }} 
              className={`w-full py-4 ${exceedsLimit ? 'bg-orange-500' : 'bg-indigo-600'} text-white rounded-2xl font-bold shadow-lg shadow-indigo-200`}
            >
              {exceedsLimit ? 'Update Limit & Start' : 'Start Focus Session'}
            </button>
          <button onClick={onClose} className="w-full py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors">Go Back</button>
        </div>
      </div>
    </div>
  );
};

const SnoozeReflectModal = ({ task, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(15);
  
  const reasons = [
    { label: "Need a break", icon: "☕" },
    { label: "High stress", icon: "wave" },
    { label: "Interrupted", icon: "phone" },
    { label: "Energy low", icon: "battery" }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
        <h2 className="text-xl font-bold dark:text-white mb-1">Pause this task?</h2>
        <p className="text-slate-500 text-sm mb-6">Why are we snoozing "{task.title}"?</p>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          {reasons.map((r) => (
            <button 
              key={r.label} 
              onClick={() => setReason(r.label)}
              className={`p-3 rounded-xl text-[10px] font-bold border transition-all ${reason === r.label ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Snooze Duration</label>
          <div className="flex gap-2">
            {[5, 15, 30, 60].map(m => (
              <button 
                key={m} 
                onClick={() => setDuration(m)} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${duration === m ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            disabled={!reason}
            onClick={() => onConfirm(reason, duration)}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 transition-all"
          >
            Confirm Snooze
          </button>
          <button onClick={onClose} className="w-full py-3 text-slate-400 text-sm font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
};