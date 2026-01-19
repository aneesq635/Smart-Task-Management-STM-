import React from 'react';

import { useState, useEffect } from 'react';
import { Check, Trash2, Edit3, Clock, Timer, AlertCircle } from "lucide-react";

const FocusCard = ({
  task,
  onUpdate,
  onDelete,
  onSnooze,
  onOpenTimer,
  onTimerEnd,
}) => {
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
    onUpdate({
      title: editTitle,
      estimateMinutes: editMinutes,
      secondsLeft: editMinutes * 60,
    });
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
  }, [
    isInProgress,
    isSnoozed,
    isPaused,
    task.secondsLeft,
    task.snoozeSecondsLeft,
  ]);

  const formatTime = (s) => {
    const absS = Math.abs(s);
    const m = Math.floor(absS / 60);
    const rs = absS % 60;
    return `${s < 0 ? "-" : ""}${m}:${rs < 10 ? "0" : ""}${rs}`;
  };

  return (
    <div
      className={`bg-white dark:bg-slate-950 p-5 rounded-2xl border transition-all shadow-sm group relative ${isCompleted ? "opacity-60 border-slate-100 dark:border-slate-800" : isInProgress ? "border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-indigo-100/50 bg-indigo-50/30 dark:bg-indigo-900/10" : isSnoozed ? "bg-amber-50/20 border-amber-200 shadow-lg shadow-amber-50 dark:border-amber-800 dark:bg-amber-950/20" : "border-slate-100 dark:border-slate-800 hover:border-indigo-500/50"}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full font-bold  ${task.energyLevel === "Low" ? "bg-green-100 text-green-600" : task.energyLevel === "High" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
          >
            {task.energyLevel} Energy
          </span>
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${task.priority === "High" ? "bg-red-500 text-white" : task.priority === "Medium" ? "bg-amber-100 text-amber-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
          >
            {task.priority} Priority
          </span>
          <span
            onClick={() => {
              if (!isCompleted && !isSnoozed) setIsEditing(true);
            }}
            className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-colors ${task.hasLimitRealityCheck ? "bg-orange-100 text-orange-600 border border-orange-200" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100"} ${isSnoozed ? "cursor-default" : "cursor-pointer"}`}
          >
            Limit: {task.estimateMinutes || 15}m
            {task.hasLimitRealityCheck && <AlertCircle size={8} />}
          </span>
          {isSnoozed && (
            <div
              className={`flex items-center gap-1.5 ${isSnoozeFinished ? "animate-bounce" : ""}`}
            >
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${isSnoozeFinished ? "bg-red-500 text-white" : "bg-amber-100 text-amber-700"}`}
              >
                {isSnoozeFinished ? "Wake Up!" : "Snoozed"}
              </span>
              {!isSnoozeFinished && (
                <span className="text-[10px] font-black tabular-nums text-amber-600 flex items-center gap-1">
                  <Timer size={10} /> {formatTime(task.snoozeSecondsLeft)}
                </span>
              )}
            </div>
          )}
          {isInProgress && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${isPaused ? "bg-amber-500 text-white" : "bg-indigo-600 text-white animate-pulse"}`}
              >
                {isPaused ? "Paused" : "Live"}
              </span>
              <span
                className={`text-[10px] font-black tabular-nums bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 ${isOvertime ? "text-red-500" : isPaused ? "text-amber-500" : "text-indigo-600"}`}
              >
                <Timer size={10} /> {formatTime(task.secondsLeft)}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && !isSnoozed && (
            <>
              <button
                onClick={onSnooze}
                className="text-slate-400 hover:text-amber-500"
              >
                <Clock size={14} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-slate-400 hover:text-indigo-600"
              >
                <Edit3 size={14} />
              </button>
            </>
          )}
          <button
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
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
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              Limit (m):
            </label>
            <input
              type="number"
              value={editMinutes}
              onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)}
              className="w-16 bg-white dark:bg-slate-800 dark:text-white rounded-lg px-2 py-1 text-sm outline-none border border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-[10px] font-bold text-slate-400 uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3
            className={`font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 ${isCompleted ? "line-through text-slate-400" : ""}`}
          >
            {task.title}
          </h3>

          <div className="flex gap-2">
            {isSnoozed ? (
              <button
                onClick={() =>
                  onUpdate({
                    status: "Pending",
                    snoozeSecondsLeft: 0,
                    isPaused: true,
                  })
                }
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100"
              >
                End Snooze & Unlock
              </button>
            ) : isInProgress ? (
              <button
                onClick={() => onUpdate({ isPaused: !isPaused })}
                className={`flex-1 ${isPaused ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"} py-2 rounded-xl text-xs font-bold transition-colors`}
              >
                {isPaused ? "Resume Session" : "Pause Focus"}
              </button>
            ) : (
              !isCompleted && (
                <button
                  onClick={onOpenTimer}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Start Focus
                </button>
              )
            )}

            {!isCompleted && !isSnoozed && (
              <button
                onClick={() =>
                  onUpdate({ status: "Completed", isPaused: true })
                }
                className="w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-green-500 hover:border-green-500 transition-all"
              >
                <Check size={18} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const TaskSection = ({
  title,
  subtitle,
  tasks,
  handleUpdateTask,
  handleDeleteTask,
  handleSnoozeTask,
  setFocusTask,
  onTimerEnd,
}) => (
  <div className="space-y-4">
    <div className="flex items-baseline gap-2">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
        {title}
      </h3>
      <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">
        — {subtitle}
      </span>
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
          <p className="text-[10px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-tighter">
            Empty Slot
          </p>
        </div>
      )}
    </div>
  </div>
);

export default TaskSection;