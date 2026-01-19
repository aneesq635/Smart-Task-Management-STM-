"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";
import supabase from "../components/supabase";
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
Send,
X,
Plus,
Loader2
} from "lucide-react";

export default function DashboardPage() {
const { user, loading } = useAuth();
const router = useRouter();

const [firstName, setFirstName] = useState("User");
const [isDark, setIsDark] = useState(false);
const [mood, setMood] = useState(null);
const [chatInput, setChatInput] = useState("");
const [aiOpen, setAiOpen] = useState(false);

/_ --- NEW STATES FOR PHASE 1 --- _/
const [tasks, setTasks] = useState([]);
const [tasksLoading, setTasksLoading] = useState(true);
const [showAddTask, setShowAddTask] = useState(false);
const [newTaskTitle, setNewTaskTitle] = useState("");

/_ 🔐 AUTH + ONBOARDING PROTECTION _/
useEffect(() => {
const protect = async () => {
const { data } = await supabase.auth.getUser();
if (!data?.user) {
router.replace("/");
return;
}

      if (!data.user.user_metadata?.has_completed_questionnaire) {
        router.replace("/onboarding");
      }
    };

    protect();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/");
        }
      }
    );

    return () => listener.subscription.unsubscribe();

}, [router]);

/_ --- FUNCTION: FETCH TASKS (GET) --- _/
const fetchTasks = useCallback(async () => {
if (!user?.id) return;
try {
setTasksLoading(true);
const res = await fetch(`/api/tasks?userId=${user.id}`);
const data = await res.json();
if (res.ok) {
setTasks(data);
}
} catch (error) {
console.error("Error fetching tasks:", error);
} finally {
setTasksLoading(false);
}
}, [user?.id]);

/_ --- FUNCTION: ADD TASK (POST) --- _/
const handleAddTask = async (e) => {
e.preventDefault();
if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: newTaskTitle,
          energyLevel: "Medium", // Default for now
          complexity: 3,         // Default for now
          psychologicalTag: "Quick Win", // Default for now
        }),
      });

      if (res.ok) {
        setNewTaskTitle("");
        setShowAddTask(false);
        fetchTasks(); // Refresh list
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }

};

/_ INITIAL DATA LOAD _/
useEffect(() => {
if (!loading && !user) router.replace("/");
if (user) {
setFirstName(user.user_metadata?.first_name || "User");
fetchTasks();
}
}, [user, loading, router, fetchTasks]);

/_ THEME SYNC _/
useEffect(() => {
setIsDark(document.documentElement.classList.contains("dark"));
}, []);

const toggleTheme = () => {
document.documentElement.classList.toggle("dark");
setIsDark((p) => !p);
};

const handleLogout = async () => {
await supabase.auth.signOut();
router.replace("/");
};

if (loading) {
return (

<div className="min-h-screen flex items-center justify-center">
<Brain className="w-10 h-10 animate-pulse text-indigo-600" />
</div>
);
}

if (!user) return null;

return (

<div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors">

      {/* SIDEBAR */}
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
          <SidebarItem icon={<MessageSquare />} label="Talk to AI" />
          <SidebarItem icon={<BarChart3 />} label="Insights" disabled />
          <SidebarItem icon={<Settings />} label="Settings" />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-0 lg:ml-64 flex flex-col">

        {/* TOP BAR */}
        <header className="h-20 fixed top-0 left-0 right-0 lg:left-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Good evening, {firstName}
            </h1>
            <p className="text-sm text-slate-500">
              Let’s keep today light and manageable.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
            </button>
            <User className="w-10 h-10 text-slate-400" />
          </div>
        </header>

        {/* CONTENT */}
        <section className="pt-24 px-8 space-y-10 overflow-y-auto flex-1 pb-10">

          {/* TODAY OVERVIEW */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Today</h2>
              <p className="text-slate-500">You have {tasks.length} tasks in your queue.</p>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> Add Task
            </button>
          </div>

          {/* ADD TASK FORM (Conditional) */}
          {showAddTask && (
            <form onSubmit={handleAddTask} className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-top-2">
              <input
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowAddTask(false)} className="px-3 py-1 text-sm text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1 text-sm bg-indigo-600 text-white rounded-lg">Save Task</button>
              </div>
            </form>
          )}

          {/* TODAY FOCUS (Now Dynamic) */}
          <div>
            <h2 className="font-bold mb-4 text-slate-900 dark:text-white">Today’s Focus</h2>
            {tasksLoading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" /></div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <FocusCard
                      key={task._id}
                      title={task.title}
                      desc={task.psychologicalTag || "Task"}
                      energy={task.energyLevel}
                    />
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">No tasks yet. Add one above!</p>
                )}
              </div>
            )}
          </div>

          {/* EMOTIONAL CHECK-IN */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h2 className="font-bold mb-4 text-slate-900 dark:text-white">
              How are you feeling right now?
            </h2>
            <div className="flex gap-6">
              <MoodIcon icon={<Smile />} active={mood === "good"} onClick={() => setMood("good")} />
              <MoodIcon icon={<Meh />} active={mood === "okay"} onClick={() => setMood("okay")} />
              <MoodIcon icon={<Frown />} active={mood === "low"} onClick={() => setMood("low")} />
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING AI BUTTON */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl animate-pulse hover:scale-105 transition z-40"
        title="Talk to me"
      >
        <Brain />
      </button>

      {/* AI CHAT PANEL */}
      {aiOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full sm:w-96 bg-white dark:bg-slate-950 h-full flex flex-col shadow-2xl">
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="font-bold text-slate-900 dark:text-white">Your AI Companion</div>
              <button onClick={() => setAiOpen(false)} className="text-slate-500 hover:text-slate-700">
                <X />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-500">
              I’m here to listen. 💬
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="What’s on your mind?"
                className="flex-1 h-11 rounded-xl px-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
              <button className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

);
}

/_ ---------- COMPONENTS ---------- _/

const SidebarItem = ({ icon, label, active, disabled }) => (

  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
      active
        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-bold"
        : disabled
        ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {React.cloneElement(icon, { size: 20 })}
    {label}
  </div>
);

const FocusCard = ({ title, desc, energy }) => (

  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 transition-colors shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
        {energy}
      </span>
    </div>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

const MoodIcon = ({ icon, active, onClick }) => (
<button
onClick={onClick}
className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
      active
        ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200 dark:shadow-none border-indigo-600"
        : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-300"
    }`}

>

    {React.cloneElement(icon, { size: 28 })}

  </button>
);













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









// "use client";

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../components/AuthContext";
// import supabase from "../components/supabase";
// import { logBehavior } from "@/lib/telemetry.js";
// import {
//   Brain,
//   LayoutDashboard,
//   CalendarCheck,
//   MessageSquare,
//   BarChart3,
//   Settings,
//   LogOut,
//   Moon,
//   Sun,
//   User,
//   Smile,
//   Meh,
//   Frown,
//   X,
//   Plus,
//   ShieldAlert,
//   Zap,
//   CheckCircle2,
//   Trash2,
//   Edit3,
//   Check,
//   Clock,
//   PlayCircle,
//   RotateCcw,
//   Trophy,
//   AlertCircle,
//   Timer,
//   PauseCircle,
// } from "lucide-react";

// export default function DashboardPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   const [firstName, setFirstName] = useState("User");
//   const [isDark, setIsDark] = useState(false);
//   const [mood, setMood] = useState(null);
//   const [chatInput, setChatInput] = useState("");
//   const [aiOpen, setAiOpen] = useState(false);
//   const [greeting, setGreeting] = useState("Good evening");

//   /* --- DATA STATES --- */
//   const [tasks, setTasks] = useState([]);
//   const [userProfile, setUserProfile] = useState(null);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [showAddTask, setShowAddTask] = useState(false);
//   const [newTaskTitle, setNewTaskTitle] = useState("");
  
//   /* --- NEW TASK RATING STATES --- */
//   const [taskDifficulty, setTaskDifficulty] = useState(2); 
//   const [taskEstimateMinutes, setTaskEstimateMinutes] = useState(15); 
//   const [taskPriority, setTaskPriority] = useState("Medium");

//   /* --- SNOOZE & FOCUS STATES --- */
//   const [snoozingTask, setSnoozingTask] = useState(null);
//   const [focusTask, setFocusTask] = useState(null);
//   const [showFocusFeedback, setShowFocusFeedback] = useState(false);

//   /* --- HYBRID INTELLIGENCE LOGIC --- */
//   const isGenerallySensitive = userProfile?.traits?.stressSensitivity > 3;
//   const isFeelingLow = mood === "low";
//   const activeTasks = tasks.filter((t) => t.status !== "Completed");
//   const isOverloaded = activeTasks.length >= 5;

//   const shouldActivateSupport = isFeelingLow || (isGenerallySensitive && mood !== "good") || isOverloaded;

//   const sortedTasks = [...tasks].sort((a, b) => {
//     const order = { "In Progress": 1, "Pending": 2, "Snoozed": 3, "Completed": 4 };
//     return (order[a.status] || 2) - (order[b.status] || 2);
//   });

//   /* --- DYNAMIC BACKGROUND LOGIC --- */
//   const getBackgroundGlow = () => {
//     if (mood === "okay") return "after:bg-blue-400/10";
//     if (mood === "good") return "after:bg-amber-400/10";
//     if (mood === "low") return "after:bg-indigo-600/15";
//     return "";
//   };

//   /* --- AI SMART SUGGESTIONS LOGIC --- */
//   const getSmartSuggestion = () => {
//     if (!mood || activeTasks.length === 0) return null;

//     if (mood === "good") {
//       const bestTask = activeTasks.find(t => t.priority === "High" && t.energyLevel === "High") ||
//                        activeTasks.find(t => t.priority === "High") ||
//                        activeTasks.find(t => t.energyLevel === "High");
      
//       if (bestTask) return `I see you're feeling 'Good'—maybe it's a great time to tackle that High Energy task: "${bestTask.title}"?`;
//     }
//     return null;
//   };

//   const aiSuggestion = getSmartSuggestion();

//   useEffect(() => {
//     const updateGreeting = () => {
//       const hour = new Date().getHours();
//       if (hour < 12) setGreeting("Good morning");
//       else if (hour < 17) setGreeting("Good afternoon");
//       else setGreeting("Good evening");
//     };
//     updateGreeting();
//   }, []);

//   useEffect(() => {
//     const protect = async () => {
//       const { data } = await supabase.auth.getUser();
//       if (!data?.user) {
//         router.replace("/");
//         return;
//       }
//       if (!data.user.user_metadata?.has_completed_questionnaire) {
//         router.replace("/onboarding");
//       } else {
//         logBehavior(data.user.id, "session_start", "dashboard_load");
//       }
//     };
//     protect();
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) router.replace("/");
//     });
//     return () => listener.subscription.unsubscribe();
//   }, [router]);

//   const fetchData = useCallback(async () => {
//     if (!user?.id) return;
//     try {
//       setDataLoading(true);
//       const [taskRes, profileRes] = await Promise.all([
//         fetch(`/api/tasks?userId=${user.id}`),
//         fetch(`/api/profile?userId=${user.id}`)
//       ]);
//       if (taskRes.ok) setTasks(await taskRes.json());
//       if (profileRes.ok) setUserProfile(await profileRes.json());
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setDataLoading(false);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     if (!loading && !user) router.replace("/");
//     if (user) {
//       setFirstName(user.user_metadata?.first_name || "User");
//       fetchData();
//     }
//   }, [user, loading, router, fetchData]);

//   const handleMoodSelect = async (selectedMood) => {
//     setMood(selectedMood);
//     logBehavior(user.id, "mood_check", selectedMood);
//     try {
//       await fetch("/api/mood", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id, mood: selectedMood, note: "Dashboard Quick-check" }),
//       });
//     } catch (e) {
//       console.error("Mood sync failed", e);
//     }
//   };

//   const handleAddTask = async (e, customTitle = null) => {
//     if (e) e.preventDefault();
//     const title = customTitle || newTaskTitle;
//     if (!title.trim()) return;

//     const timeWeight = taskEstimateMinutes <= 15 ? 1 : taskEstimateMinutes <= 45 ? 2 : 3;
//     const energyScore = taskDifficulty + timeWeight;
//     let energyLevel = "Medium";
//     let psychologicalTag = "Quick Win";

//     if (energyScore <= 3) {
//       energyLevel = "Low";
//       psychologicalTag = "Easy Start";
//     } else if (energyScore >= 7) {
//       energyLevel = "High";
//       psychologicalTag = "Deep Focus";
//     }

//     if (shouldActivateSupport) psychologicalTag = "Micro-step";

//     try {
//       const res = await fetch("/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user.id,
//           title: title,
//           energyLevel: energyLevel,
//           complexity: taskDifficulty,
//           priority: taskPriority,
//           psychologicalTag: psychologicalTag,
//           estimateMinutes: taskEstimateMinutes,
//           secondsLeft: taskEstimateMinutes * 60,
//           isPaused: true,
//         }),
//       });

//       if (res.ok) {
//         logBehavior(user.id, "task_create", { difficulty: taskDifficulty, estimate: taskEstimateMinutes, priority: taskPriority });
//         setNewTaskTitle("");
//         setTaskDifficulty(2);
//         setTaskEstimateMinutes(15);
//         setTaskPriority("Medium");
//         setShowAddTask(false);
//         fetchData(); 
//       }
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   const handleUpdateTask = async (taskId, updates) => {
//     setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updates } : t));
//     try {
//       const res = await fetch(`/api/tasks/${taskId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       });
//       if (res.ok) logBehavior(user.id, "task_update", taskId);
//       else fetchData();
//     } catch (error) {
//       console.error("Network error during update:", error);
//       fetchData();
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     setTasks(prev => prev.filter(t => t._id !== taskId));
//     try {
//       const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
//       if (!res.ok) fetchData();
//     } catch (error) {
//       fetchData();
//     }
//   };

//   const handleSnoozeTask = (task) => setSnoozingTask(task);

//   const confirmSnooze = async (reason, duration) => {
//     if (!snoozingTask) return;
//     const newCount = (snoozingTask.snoozeCount || 0) + 1;
//     handleUpdateTask(snoozingTask._id, { 
//       snoozeCount: newCount, 
//       status: "Snoozed",
//       lastSnoozeReason: reason,
//       snoozedAt: new Date().toISOString(),
//       snoozeUntil: duration,
//       isPaused: true
//     });
//     logBehavior(user.id, "task_snooze_detailed", { taskId: snoozingTask._id, reason, duration });
//     setSnoozingTask(null);
//   };

//   const onTimerEnd = (taskId) => {
//     handleUpdateTask(taskId, { status: "Completed", isPaused: true });
//     setFocusTask(null);
//     setShowFocusFeedback(true);
//   };

//   useEffect(() => {
//     setIsDark(document.documentElement.classList.contains("dark"));
//   }, []);

//   const toggleTheme = () => {
//     document.documentElement.classList.toggle("dark");
//     setIsDark((prev) => !prev);
//     if (user) logBehavior(user.id, "ui_toggle", isDark ? "light_mode" : "dark_mode");
//   };

//   const handleLogout = async () => {
//     if (user) logBehavior(user.id, "auth_logout");
//     await supabase.auth.signOut();
//     router.replace("/");
//   };

//   if (loading || dataLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Brain className="w-10 h-10 animate-pulse text-indigo-600" />
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-x-hidden after:content-[''] after:fixed after:top-[-10%] after:right-[-10%] after:w-[50%] after:h-[50%] after:rounded-full after:blur-[120px] after:z-0 after:transition-all after:duration-1000 ${getBackgroundGlow()}`}>
//       <aside className="w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:flex flex-col z-30">
//         <div className="flex items-center gap-2 mb-10">
//           <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
//             <Brain className="text-white w-5 h-5" />
//           </div>
//           <span className="font-bold text-xl text-slate-900 dark:text-white">MindSync</span>
//         </div>
//         <nav className="space-y-1 flex-1">
//           <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
//           <SidebarItem icon={<CalendarCheck />} label="Today’s Plan" />
//           <SidebarItem 
//             icon={<MessageSquare />} 
//             label="Talk to AI" 
//             onClick={() => { setAiOpen(true); logBehavior(user.id, "ai_interact", "sidebar_open"); }} 
//           />
//           <SidebarItem icon={<BarChart3 />} label="Insights" disabled />
//           <SidebarItem icon={<Settings />} label="Settings" />
//         </nav>
//         <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 rounded-xl transition-colors">
//           <LogOut className="w-5 h-5" /> Logout
//         </button>
//       </aside>

//       <main className="flex-1 ml-0 lg:ml-64 flex flex-col relative z-10">
//         <header className="h-20 fixed top-0 left-0 right-0 lg:left-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-20">
//           <div>
//             <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//               {shouldActivateSupport ? "Take it easy, " : `${greeting}, `}{firstName}
//             </h1>
//             <p className="text-sm text-slate-500">
//               {isFeelingLow ? "I'm here to support you. Let's keep things very simple." : 
//                isOverloaded ? "You've got a lot on your plate. Focus on one small win." :
//                "Let’s keep today light and manageable."}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button onClick={toggleTheme} className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
//               {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
//             </button>
//             <User className="w-10 h-10 text-slate-400" />
//           </div>
//         </header>

//         <section className="pt-24 px-8 space-y-10 overflow-y-auto flex-1 pb-10">
//           {aiSuggestion && (
//             <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
//               <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center text-amber-600">
//                 <Brain size={20} />
//               </div>
//               <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">{aiSuggestion}</p>
//             </div>
//           )}

//           {shouldActivateSupport && !aiSuggestion && (
//             <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
//               <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600">
//                 <ShieldAlert size={20} />
//               </div>
//               <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">
//                 {isFeelingLow ? "Supportive Mode Active: Tasks will be broken into micro-steps." : "High Workload Detected: I've prioritized low-energy wins for you."}
//               </p>
//             </div>
//           )}

//           <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
//             <div className="flex items-center gap-6">
//               <div>
//                 <h2 className="font-bold text-lg text-slate-900 dark:text-white">Today's Focus</h2>
//                 <p className="text-slate-500 text-sm">{activeTasks.length} active items</p>
//               </div>
//             </div>
//             <button onClick={() => setShowAddTask(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
//               <Plus size={18} /> Add Task
//             </button>
//           </div>

//           {showAddTask && (
//             <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-indigo-500 shadow-xl animate-in zoom-in-95 space-y-4">
//               <input
//                 autoFocus
//                 value={newTaskTitle}
//                 onChange={(e) => setNewTaskTitle(e.target.value)}
//                 placeholder="What needs to be done?"
//                 className="w-full bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
//               />
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-y border-slate-100 dark:border-slate-800">
//                 <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Difficulty (1-5)</label>
//                   <div className="flex gap-2">
//                     {[1, 2, 3, 4, 5].map((num) => (
//                       <button
//                         key={num}
//                         type="button"
//                         onClick={() => setTaskDifficulty(num)}
//                         className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${taskDifficulty === num ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
//                       >
//                         {num}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Task Limit (Minutes)</label>
//                   <div className="flex flex-col gap-2">
//                     <input 
//                       type="number"
//                       value={taskEstimateMinutes}
//                       onChange={(e) => setTaskEstimateMinutes(parseInt(e.target.value) || 0)}
//                       className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
//                     />
//                     <div className="flex gap-1 flex-wrap">
//                       {[15, 30, 45, 60, 90].map((m) => (
//                         <button
//                           key={m}
//                           type="button"
//                           onClick={() => setTaskEstimateMinutes(m)}
//                           className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${taskEstimateMinutes === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
//                         >
//                           {m}m
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Priority</label>
//                   <div className="flex gap-2">
//                     {['Low', 'Medium', 'High'].map((p) => (
//                       <button
//                         key={p}
//                         type="button"
//                         onClick={() => setTaskPriority(p)}
//                         className={`px-3 h-8 rounded-lg text-[10px] font-bold transition-all ${taskPriority === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
//                       >
//                         {p}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest flex items-center gap-1">
//                   <Zap size={12} /> {shouldActivateSupport ? "AI: Auto-simplifying" : "AI: Priority context applied"}
//                 </span>
//                 <div className="flex gap-2">
//                   <button type="button" onClick={() => setShowAddTask(false)} className="px-3 py-1 text-sm text-slate-500">Cancel</button>
//                   <button type="submit" className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Create Task</button>
//                 </div>
//               </div>
//             </form>
//           )}

//           <div className="grid gap-4 md:grid-cols-3">
//             {tasks.length > 0 ? (
//               activeTasks.length === 0 ? (
//                 <div className="col-span-full py-12 flex flex-col items-center justify-center bg-green-50/50 dark:bg-green-900/10 border-2 border-dashed border-green-200 dark:border-green-800/50 rounded-3xl animate-in zoom-in-95">
//                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-4">
//                     <Trophy size={32} />
//                   </div>
//                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Woohoo! All tasks done for today! 🥳</h3>
//                   <p className="text-slate-500 dark:text-slate-400 mt-2">You've cleared your plate. Time to recharge.</p>
//                 </div>
//               ) : (
//                 sortedTasks.map((task) => (
//                   <FocusCard
//                     key={task._id}
//                     task={task}
//                     onUpdate={(updates) => handleUpdateTask(task._id, updates)}
//                     onDelete={() => handleDeleteTask(task._id)}
//                     onSnooze={() => handleSnoozeTask(task)}
//                     onOpenTimer={() => setFocusTask(task)}
//                     onTimerEnd={() => onTimerEnd(task._id)}
//                   />
//                 ))
//               )
//             ) : (
//               <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
//                 <p className="text-slate-400 italic">No tasks for now. 😊 Add one above!</p>
//               </div>
//             )}
//           </div>

//           <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
//             <h2 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">How are you feeling right now?</h2>
//             <div className="flex justify-center gap-8">
//               <MoodIcon icon={<Smile />} active={mood === "good"} label="Good" onClick={() => handleMoodSelect("good")} />
//               <MoodIcon icon={<Meh />} active={mood === "okay"} label="Okay" onClick={() => handleMoodSelect("okay")} />
//               <MoodIcon icon={<Frown />} active={mood === "low"} label="Low" onClick={() => handleMoodSelect("low")} />
//             </div>
//           </div>
//         </section>
//       </main>

//       <button onClick={() => setAiOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] transition-all z-40 group">
//         <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 group-hover:opacity-40"></div>
//         <MessageSquare size={24} className="relative z-10" />
//       </button>

//       {snoozingTask && <SnoozeReflectModal task={snoozingTask} onClose={() => setSnoozingTask(null)} onConfirm={confirmSnooze} />}
      
//       {focusTask && (
//         <FocusSessionSetupModal 
//           task={focusTask} 
//           onClose={() => setFocusTask(null)} 
//           onUpdateTask={(updates) => handleUpdateTask(focusTask._id, updates)}
//         />
//       )}

//       {showFocusFeedback && (
//         <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl max-w-sm w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
//              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
//                 <Brain size={32} />
//              </div>
//              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Great job on that stretch!</h2>
//              <p className="text-slate-500 dark:text-slate-400 mb-6">How are you feeling now?</p>
//              <div className="flex justify-center gap-4 mb-6">
//                 <button onClick={() => { handleMoodSelect("good"); setShowFocusFeedback(false); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 transition-colors"><Smile className="text-amber-500" /></button>
//                 <button onClick={() => { handleMoodSelect("okay"); setShowFocusFeedback(false); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 transition-colors"><Meh className="text-blue-500" /></button>
//                 <button onClick={() => { handleMoodSelect("low"); setShowFocusFeedback(false); }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 transition-colors"><Frown className="text-indigo-500" /></button>
//              </div>
//              <button onClick={() => setShowFocusFeedback(false)} className="text-slate-400 text-sm font-medium hover:text-slate-600">Dismiss</button>
//           </div>
//         </div>
//       )}

//       {aiOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
//           <div className="w-full sm:w-96 bg-white dark:bg-slate-950 h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
//             <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
//               <div className="font-bold text-slate-900 dark:text-white">Your AI Companion</div>
//               <button onClick={() => setAiOpen(false)} className="text-slate-500 hover:text-slate-700"><X /></button>
//             </div>
//             <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-500">
//                 {shouldActivateSupport ? "I've noticed you might be feeling a bit under pressure. I'm here to help you simplify things." : "I’m here to listen. 💬"}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- COMPONENTS ---------- */

// const SidebarItem = ({ icon, label, active, disabled, onClick }) => (
//   <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-bold" : disabled ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"}`}>
//     {React.cloneElement(icon, { size: 20 })}
//     {label}
//   </div>
// );

// const FocusCard = ({ task, onUpdate, onDelete, onSnooze, onOpenTimer, onTimerEnd }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTitle, setEditTitle] = useState(task.title);
//   const [editMinutes, setEditMinutes] = useState(task.estimateMinutes || 15);
  
//   const isCompleted = task.status === "Completed";
//   const isInProgress = task.status === "In Progress";
//   const isSnoozed = task.status === "Snoozed";
//   const isPaused = task.isPaused;
//   const isOvertime = task.secondsLeft <= 0;

//   const handleSave = () => { 
//     onUpdate({ title: editTitle, estimateMinutes: editMinutes, secondsLeft: editMinutes * 60 }); 
//     setIsEditing(false); 
//   };

//   useEffect(() => {
//     let interval = null;
//     if (isInProgress && !isPaused) {
//       interval = setInterval(() => {
//         const nextSeconds = task.secondsLeft - 1;
//         onUpdate({ secondsLeft: nextSeconds });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isInProgress, isPaused, task.secondsLeft]);

//   const formatTime = (s) => {
//     const absS = Math.abs(s);
//     const m = Math.floor(absS / 60);
//     const rs = absS % 60;
//     return `${s < 0 ? '-' : ''}${m}:${rs < 10 ? '0' : ''}${rs}`;
//   };

//   const handleAddTime = (minutes) => {
//     const newLimit = (task.estimateMinutes || 0) + minutes;
//     onUpdate({ 
//       secondsLeft: task.secondsLeft + (minutes * 60), 
//       estimateMinutes: newLimit 
//     });
//   };

//   return (
//     <div className={`bg-white dark:bg-slate-950 p-5 rounded-2xl border transition-all shadow-sm group relative ${isCompleted ? 'opacity-60 border-slate-100 dark:border-slate-800' : isInProgress ? 'border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-indigo-100/50 bg-indigo-50/30 dark:bg-indigo-900/10' : isSnoozed ? 'bg-slate-50/50 dark:bg-slate-900/50 border-amber-200/50 grayscale-[0.5]' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-500/50'}`}>
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex items-center gap-2 flex-wrap">
//             <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold  ${task.energyLevel === "Low" ? "bg-green-100 text-green-600" : task.energyLevel === "High" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
//                 {task.energyLevel} Energy
//             </span>
//             <span 
//               onClick={() => { if(!isCompleted) setIsEditing(true); }}
//               className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
//             >
//               Limit: {task.estimateMinutes || 15}m
//             </span>
//             {task.snoozeCount > 0 && <span className="text-[9px] flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full"><Clock size={10}/> {task.snoozeCount}</span>}
//             {isSnoozed && <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-700">Snoozed</span>}
//             {isInProgress && (
//                 <div className="flex items-center gap-1.5">
//                     <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${isPaused ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white animate-pulse'}`}>
//                       {isPaused ? 'Paused' : 'Live'}
//                     </span>
//                     <span className={`text-[10px] font-black tabular-nums bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 ${isOvertime ? 'text-red-500' : isPaused ? 'text-amber-500' : 'text-indigo-600'}`}>
//                         <Timer size={10}/> {formatTime(task.secondsLeft)}
//                     </span>
//                 </div>
//             )}
//         </div>
//         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           {!isCompleted && !isSnoozed && <button onClick={onSnooze} className="flex items-center gap-0 overflow-hidden hover:gap-2 px-2 py-1 rounded-lg transition-all duration-300 max-w-[32px] hover:max-w-[100px] whitespace-nowrap group/btn bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-amber-500 hover:bg-amber-50"><Clock size={14} className="shrink-0" /><span className="text-[10px] font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase">Snooze</span></button>}
//           {isSnoozed && <button onClick={() => onUpdate({ status: "Pending" })} className="flex items-center gap-0 overflow-hidden hover:gap-2 px-2 py-1 rounded-lg transition-all duration-300 max-w-[32px] hover:max-w-[110px] whitespace-nowrap group/btn bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100"><RotateCcw size={14} className="shrink-0" /><span className="text-[10px] font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase">Unsnooze</span></button>}
//           {!isCompleted && <button onClick={() => setIsEditing(!isEditing)} className="text-slate-400 hover:text-indigo-600"><Edit3 size={14}/></button>}
//           <button onClick={onDelete} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
//         </div>
//       </div>
//       {isEditing ? (
//         <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900">
//           <input 
//             value={editTitle} 
//             onChange={(e) => setEditTitle(e.target.value)} 
//             className="w-full bg-white dark:bg-slate-950 rounded-lg px-2 py-1.5 text-sm outline-none border border-indigo-500 shadow-sm" 
//             autoFocus 
//           />
//           <div className="space-y-2">
//             <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Adjust Limit (Minutes)</label>
//             <div className="flex gap-2 items-center">
//               <input 
//                 type="number"
//                 value={editMinutes}
//                 onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)}
//                 className="w-16 bg-white dark:bg-slate-950 rounded-lg px-2 py-1 text-xs border border-slate-200"
//               />
//               <div className="flex gap-1">
//                 {[15, 30, 45, 60].map(m => (
//                   <button key={m} onClick={() => setEditMinutes(m)} className={`px-2 py-1 text-[10px] rounded-md font-bold ${editMinutes === m ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>{m}m</button>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end gap-2 pt-1">
//             <button onClick={() => setIsEditing(false)} className="text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
//             <button onClick={handleSave} className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg uppercase tracking-wider">Save</button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <h3 className={`font-bold text-slate-800 dark:text-white leading-tight mb-4 ${isCompleted ? 'line-through' : ''}`}>
//             {task.title}
//           </h3>

//           {isInProgress && isOvertime && !isCompleted && (
//             <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl animate-in zoom-in-95">
//               <div className="flex items-center gap-2 mb-3">
//                 <AlertCircle className="text-red-500 w-4 h-4" />
//                 <span className="text-xs font-bold text-red-700 dark:text-red-400">Are you finished?</span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <button 
//                   onClick={onTimerEnd}
//                   className="flex-1 bg-red-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-red-700 transition-colors uppercase"
//                 >
//                   Yes, Done
//                 </button>
//                 <div className="w-full flex gap-1 mt-1">
//                    <span className="text-[9px] text-slate-500 font-bold self-center mr-1 uppercase">Add:</span>
//                    {[5, 10, 15].map(m => (
//                      <button 
//                        key={m} 
//                        onClick={() => handleAddTime(m)}
//                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-600 text-[9px] font-bold rounded hover:bg-red-50 transition-colors"
//                      >
//                        +{m}m
//                      </button>
//                    ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {!isCompleted && (
//             <div className="flex gap-2 mt-auto">
//               {isInProgress ? (
//                 <>
//                   <button onClick={() => onUpdate({ isPaused: !isPaused })} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${isPaused ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
//                     {isPaused ? <PlayCircle size={16}/> : <PauseCircle size={16}/>}
//                     {isPaused ? "Resume" : "Pause"}
//                   </button>
//                   <button onClick={() => onUpdate({ status: "Pending", isPaused: true })} className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
//                     <X size={16}/>
//                   </button>
//                 </>
//               ) : (
//                 <button onClick={onOpenTimer} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
//                   <PlayCircle size={16}/> Start Session
//                 </button>
//               )}
//               <button onClick={() => onUpdate({ status: "Completed", isPaused: true })} className={`w-10 flex items-center justify-center rounded-xl border transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 dark:border-slate-800 text-slate-300 hover:border-green-500 hover:text-green-500'}`}>
//                 <Check size={18}/>
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// const FocusSessionSetupModal = ({ task, onClose, onUpdateTask }) => {
//   const [mins, setMins] = useState(task.estimateMinutes || 15);
//   const [showChoice, setShowChoice] = useState(false);

//   // When mins changes, check if it exceeds current task limit
//   useEffect(() => {
//     if (mins > (task.estimateMinutes || 0)) {
//         setShowChoice(true);
//     } else {
//         setShowChoice(false);
//     }
//   }, [mins, task.estimateMinutes]);

//   const handleStart = () => {
//     // If user starts with same or less time, we just set the timer.
//     // If user starts with MORE time and chose NOT to trigger Choice UI, we still allow start.
//     onUpdateTask({ 
//       status: "In Progress", 
//       secondsLeft: mins * 60, 
//       isPaused: false 
//     });
//     onClose();
//   };

//   const handleReset = () => {
//     onUpdateTask({ 
//         secondsLeft: (task.estimateMinutes || 15) * 60, 
//         isPaused: true 
//     });
//     onClose();
//   };

//   const updateEstimateOnly = () => {
//     onUpdateTask({ estimateMinutes: mins });
//     onClose();
//   };

//   const updateBoth = () => {
//     // This correctly updates BOTH the task definition (limit) and the active timer
//     onUpdateTask({ 
//         estimateMinutes: mins, 
//         secondsLeft: mins * 60,
//         status: "In Progress",
//         isPaused: false
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-slate-950 w-full max-w-sm rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
//         <div className="p-8">
//           <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
//             <Timer size={24} />
//           </div>
//           <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Focus Session</h2>
//           <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 italic">"{task.title}"</p>
          
//           <div className="space-y-6">
//             <div>
//               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Set Session Duration</label>
//               <div className="flex items-center gap-4 mb-4">
//                 <input 
//                   type="number"
//                   value={mins}
//                   onChange={(e) => setMins(parseInt(e.target.value) || 0)}
//                   className="w-24 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xl font-bold text-indigo-600 outline-none focus:border-indigo-500 transition-all"
//                 />
//                 <span className="font-bold text-slate-400">minutes</span>
//               </div>
//               <div className="grid grid-cols-4 gap-2">
//                 {[15, 25, 45, 60].map(m => (
//                   <button key={m} onClick={() => setMins(m)} className={`py-2 rounded-xl text-xs font-bold transition-all ${mins === m ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'}`}>{m}m</button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {showChoice ? (
//           <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-900 animate-in slide-in-from-bottom-2">
//             <div className="flex items-start gap-2 mb-4">
//                 <AlertCircle className="text-indigo-600 w-4 h-4 mt-0.5" />
//                 <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">This exceeds your original {task.estimateMinutes}m limit. Update task definition?</p>
//             </div>
//             <div className="space-y-2">
//               <button onClick={updateBoth} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-200">Yes, Update Limit</button>
//               <button onClick={handleStart} className="w-full py-3 bg-white dark:bg-slate-800 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-indigo-200">No, Temporary Session</button>
//             </div>
//           </div>
//         ) : (
//           <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
//             <button onClick={onClose} className="flex-1 py-4 text-slate-500 text-sm font-bold">Cancel</button>
//             {task.status === "In Progress" ? (
//               <div className="flex gap-2 flex-[2]">
//                 <button onClick={handleReset} className="flex-1 py-4 bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 uppercase tracking-tight"><RotateCcw size={14}/> Reset</button>
//                 <button onClick={handleStart} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/20 uppercase tracking-tight">Apply</button>
//               </div>
//             ) : (
//               <button onClick={handleStart} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20">Start Now</button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const SnoozeReflectModal = ({ task, onClose, onConfirm }) => {
//   const [reason, setReason] = useState("");
//   const [duration, setDuration] = useState("30m");
//   const reasons = [
//     { id: 'energy', label: 'Low Energy', icon: '🔋' },
//     { id: 'focus', label: 'Can\'t Focus', icon: '🧠' },
//     { id: 'priority', label: 'Higher Priority', icon: '⚠️' },
//     { id: 'other', label: 'Need a Break', icon: '☕' }
//   ];

//   return (
//     <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-slate-950 w-full max-w-sm rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
//         <div className="p-8">
//           <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
//             <Clock size={24} />
//           </div>
//           <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Wait a second...</h2>
//           <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">It's okay to snooze, but let's be honest with ourselves. Why are we pushing this back?</p>
          
//           <div className="space-y-6">
//             <div>
//               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Reason for Snooze</label>
//               <div className="grid grid-cols-2 gap-3">
//                 {reasons.map(r => (
//                   <button key={r.id} onClick={() => setReason(r.label)} className={`p-3 rounded-2xl border-2 text-left transition-all ${reason === r.label ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-amber-200'}`}>
//                     <span className="block text-xl mb-1">{r.icon}</span>
//                     <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{r.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Coming back in...</label>
//               <div className="flex gap-2">
//                 {['15m', '30m', '1h', '2h', 'Tomorrow'].map(d => (
//                   <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${duration === d ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{d}</button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
//           <button onClick={onClose} className="flex-1 py-4 text-slate-500 text-sm font-bold">Nevermind</button>
//           <button 
//             disabled={!reason}
//             onClick={() => onConfirm(reason, duration)} 
//             className="flex-[2] py-4 bg-amber-500 disabled:opacity-50 disabled:grayscale text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
//           >
//             Snooze Task
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MoodIcon = ({ icon, active, label, onClick }) => (
//   <button onClick={onClick} className="group flex flex-col items-center gap-2">
//     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : "bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}>
//       {React.cloneElement(icon, { size: 28 })}
//     </div>
//     <span className={`text-xs font-bold transition-colors ${active ? "text-indigo-600" : "text-slate-400"}`}>{label}</span>
//   </button>
// );
















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



****************\*\*\*****************Different Themes**************************\*\***************************
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";
import supabase from "../components/supabase";
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
Send,
X,
Plus,
Loader2,
Palette
} from "lucide-react";

export default function DashboardPage() {
const { user, loading } = useAuth();
const router = useRouter();

const [firstName, setFirstName] = useState("User");
const [isDark, setIsDark] = useState(false);
const [mood, setMood] = useState(null);
const [chatInput, setChatInput] = useState("");
const [aiOpen, setAiOpen] = useState(false);

// Theme Switching Logic (Organic, Lavender, Minimalist)
const [activePalette, setActivePalette] = useState("theme-organic");

/_ --- NEW STATES FOR PHASE 1 --- _/
const [tasks, setTasks] = useState([]);
const [tasksLoading, setTasksLoading] = useState(true);
const [showAddTask, setShowAddTask] = useState(false);
const [newTaskTitle, setNewTaskTitle] = useState("");

/_ 🔐 AUTH + ONBOARDING PROTECTION _/
useEffect(() => {
const protect = async () => {
const { data } = await supabase.auth.getUser();
if (!data?.user) {
router.replace("/");
return;
}
if (!data.user.user_metadata?.has_completed_questionnaire) {
router.replace("/onboarding");
}
};
protect();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/");
        }
      }
    );
    return () => listener.subscription.unsubscribe();

}, [router]);

/_ --- FUNCTION: FETCH TASKS (GET) --- _/
const fetchTasks = useCallback(async () => {
if (!user?.id) return;
try {
setTasksLoading(true);
const res = await fetch(`/api/tasks?userId=${user.id}`);
const data = await res.json();
if (res.ok) {
setTasks(data);
}
} catch (error) {
console.error("Error fetching tasks:", error);
} finally {
setTasksLoading(false);
}
}, [user?.id]);

/_ --- FUNCTION: ADD TASK (POST) --- _/
const handleAddTask = async (e) => {
e.preventDefault();
if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: newTaskTitle,
          energyLevel: "Medium",
          complexity: 3,
          psychologicalTag: "Quick Win",
        }),
      });

      if (res.ok) {
        setNewTaskTitle("");
        setShowAddTask(false);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }

};

/_ INITIAL DATA LOAD _/
useEffect(() => {
if (!loading && !user) router.replace("/");
if (user) {
setFirstName(user.user_metadata?.first_name || "User");
fetchTasks();
}
}, [user, loading, router, fetchTasks]);

/_ THEME SYNC _/
useEffect(() => {
setIsDark(document.documentElement.classList.contains("dark"));
}, []);

const toggleTheme = () => {
document.documentElement.classList.toggle("dark");
setIsDark((p) => !p);
};

const handleLogout = async () => {
await supabase.auth.signOut();
router.replace("/");
};

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center bg-white">
<Brain className="w-10 h-10 animate-pulse text-slate-400" />
</div>
);
}

if (!user) return null;

return (
<div className={`${activePalette} transition-colors duration-500`}>
{/_ INJECTED STYLES FOR THE 3 COMBOS _/}
<style jsx global>{`
/_ 1. Organic Tech _/
.theme-organic {
--bg: #F9F8F4; --surf: #FFFFFF; --bord: #E5E7EB;
--prim: #8DA399; --sec: #7A8D99; --acc: #B4A7D6;
--txt: #2F3633; --txt-m: #5C6661;
}
.dark .theme-organic {
--bg: #1A1D1C; --surf: #242927; --bord: #2D3331;
--prim: #A3B5AD; --sec: #90A1AD; --acc: #C5BCE0;
--txt: #EAECEB; --txt-m: #A0A9A5;
}

        /* 2. Soft Lavender */
        .theme-lavender {
          --bg: #FCFAFF; --surf: #FFFFFF; --bord: #EBE8F0;
          --prim: #9689B8; --sec: #8DA399; --acc: #7A8D99;
          --txt: #1E1B24; --txt-m: #5D586B;
        }
        .dark .theme-lavender {
          --bg: #16141C; --surf: #1F1D26; --bord: #2B2833;
          --prim: #B4A7D6; --sec: #8DA399; --acc: #A5B2B9;
          --txt: #F2F0F5; --txt-m: #9E9AA8;
        }

        /* 3. Minimalist Slate */
        .theme-minimalist {
          --bg: #F5F7F7; --surf: #FFFFFF; --bord: #E1E5E5;
          --prim: #6B7D87; --sec: #A7B8B0; --acc: #D1C9E3;
          --txt: #242A2E; --txt-m: #545E63;
        }
        .dark .theme-minimalist {
          --bg: #0F1214; --surf: #171B1E; --bord: #21272B;
          --prim: #8DA399; --sec: #7A8D99; --acc: #B4A7D6;
          --txt: #E6E9EB; --txt-m: #8B969C;
        }

        /* Logic mapping */
        .custom-bg { background-color: var(--bg); }
        .custom-surf { background-color: var(--surf); }
        .custom-bord { border-color: var(--bord); }
        .custom-txt { color: var(--txt); }
        .custom-txt-m { color: var(--txt-m); }
        .custom-prim-bg { background-color: var(--prim); }
        .custom-prim-txt { color: var(--prim); }
        .custom-sec-bg { background-color: var(--sec); }
        .custom-acc-bg { background-color: var(--acc); }
      `}</style>

      <div className="min-h-screen flex custom-bg transition-colors">
        {/* SIDEBAR */}
        <aside className="w-64 fixed left-0 top-0 bottom-0 custom-surf border-r custom-bord p-6 hidden lg:flex flex-col z-30">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 custom-prim-bg rounded-xl flex items-center justify-center shadow-sm">
              <Brain className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl custom-txt">MindSync</span>
          </div>

          <nav className="space-y-1 flex-1">
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
            <SidebarItem icon={<CalendarCheck />} label="Today’s Plan" />
            <SidebarItem icon={<MessageSquare />} label="Talk to AI" />
            <SidebarItem icon={<BarChart3 />} label="Insights" disabled />
            <SidebarItem icon={<Settings />} label="Settings" />
          </nav>

          {/* PALETTE SWITCHER FOR TESTING */}
          <div className="mb-6 p-3 rounded-xl bg-black/5 dark:bg-white/5 border custom-bord">
            <p className="text-[10px] uppercase font-bold custom-txt-m mb-2 flex items-center gap-1">
               <Palette size={12}/> Switch Palette
            </p>
            <div className="flex gap-2">
                <button onClick={() => setActivePalette('theme-organic')} className="w-6 h-6 rounded-full bg-[#8DA399] border border-white" title="Organic" />
                <button onClick={() => setActivePalette('theme-lavender')} className="w-6 h-6 rounded-full bg-[#9689B8] border border-white" title="Lavender" />
                <button onClick={() => setActivePalette('theme-minimalist')} className="w-6 h-6 rounded-full bg-[#6B7D87] border border-white" title="Minimalist" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 custom-txt-m hover:text-red-500 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 ml-0 lg:ml-64 flex flex-col">
          {/* TOP BAR */}
          <header className="h-20 fixed top-0 left-0 right-0 lg:left-64 custom-surf/80 backdrop-blur-md border-b custom-bord px-8 flex items-center justify-between z-20">
            <div>
              <h1 className="text-xl font-bold custom-txt">
                Good evening, {firstName}
              </h1>
              <p className="text-sm custom-txt-m">
                Let’s keep today light and manageable.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-11 h-11 rounded-xl border custom-bord flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                {isDark ? <Sun className="text-yellow-400" /> : <Moon className="custom-txt-m" />}
              </button>
              <div className="w-10 h-10 rounded-full custom-acc-bg flex items-center justify-center">
                <User className="text-white w-5 h-5" />
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <section className="pt-24 px-8 space-y-10 overflow-y-auto flex-1 pb-10">
            {/* TODAY OVERVIEW */}
            <div className="custom-surf p-6 rounded-3xl border custom-bord flex justify-between items-center shadow-sm">
              <div>
                <h2 className="font-bold text-lg mb-1 custom-txt">Today</h2>
                <p className="custom-txt-m">You have {tasks.length} tasks in your queue.</p>
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                className="custom-prim-bg hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                <Plus size={18} /> Add Task
              </button>
            </div>

            {/* ADD TASK FORM */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-dashed custom-bord animate-in fade-in slide-in-from-top-2">
                <input
                  autoFocus
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-transparent border-none outline-none custom-txt font-medium placeholder:opacity-50"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={() => setShowAddTask(false)} className="px-3 py-1 text-sm custom-txt-m">Cancel</button>
                  <button type="submit" className="px-4 py-1 text-sm custom-prim-bg text-white rounded-lg">Save Task</button>
                </div>
              </form>
            )}

            {/* TODAY FOCUS */}
            <div>
              <h2 className="font-bold mb-4 custom-txt">Today’s Focus</h2>
              {tasksLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin custom-prim-txt" /></div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <FocusCard
                        key={task._id}
                        title={task.title}
                        desc={task.psychologicalTag || "Task"}
                        energy={task.energyLevel}
                      />
                    ))
                  ) : (
                    <p className="custom-txt-m text-sm italic">No tasks yet. Add one above!</p>
                  )}
                </div>
              )}
            </div>

            {/* EMOTIONAL CHECK-IN */}
            <div className="custom-surf p-6 rounded-3xl border custom-bord shadow-sm">
              <h2 className="font-bold mb-4 custom-txt">
                How are you feeling right now?
              </h2>
              <div className="flex gap-6">
                <MoodIcon icon={<Smile />} active={mood === "good"} onClick={() => setMood("good")} />
                <MoodIcon icon={<Meh />} active={mood === "okay"} onClick={() => setMood("okay")} />
                <MoodIcon icon={<Frown />} active={mood === "low"} onClick={() => setMood("low")} />
              </div>
            </div>
          </section>
        </main>

        {/* FLOATING AI BUTTON */}
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full custom-prim-bg flex items-center justify-center text-white shadow-2xl hover:scale-105 transition z-40"
          title="Talk to me"
        >
          <Brain />
        </button>

        {/* AI CHAT PANEL */}
        {aiOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full sm:w-96 custom-surf h-full flex flex-col shadow-2xl">
              <div className="h-16 px-6 border-b custom-bord flex items-center justify-between">
                <div className="font-bold custom-txt">Your AI Companion</div>
                <button onClick={() => setAiOpen(false)} className="custom-txt-m hover:custom-txt">
                  <X />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto text-sm custom-txt-m">
                I’m here to listen. 💬
              </div>
              <div className="p-4 border-t custom-bord flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="What’s on your mind?"
                  className="flex-1 h-11 rounded-xl px-4 border custom-bord custom-bg custom-txt outline-none focus:border-[var(--prim)]"
                />
                <button className="w-11 h-11 custom-prim-bg rounded-xl flex items-center justify-center text-white transition-opacity hover:opacity-90">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

);
}

/_ ---------- COMPONENTS ---------- _/

const SidebarItem = ({ icon, label, active, disabled }) => (

  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
      active
        ? "bg-[var(--prim)] text-white font-bold shadow-sm"
        : disabled
        ? "opacity-30 cursor-not-allowed custom-txt-m"
        : "custom-txt-m hover:bg-black/5 hover:custom-txt"
    }`}
  >
    {React.cloneElement(icon, { size: 20 })}
    {label}
  </div>
);

const FocusCard = ({ title, desc, energy }) => (

  <div className="custom-surf p-5 rounded-2xl border custom-bord hover:border-[var(--prim)] transition-colors shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold custom-txt">{title}</h3>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 custom-txt-m uppercase tracking-wider font-semibold">
        {energy}
      </span>
    </div>
    <p className="text-sm custom-txt-m">{desc}</p>
  </div>
);

const MoodIcon = ({ icon, active, onClick }) => (
<button
onClick={onClick}
className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
      active
        ? "bg-[var(--acc)] text-white scale-110 shadow-lg border-[var(--acc)]"
        : "bg-black/5 custom-txt-m border-transparent hover:custom-bord"
    }`}

>

    {React.cloneElement(icon, { size: 28 })}

  </button>
);
