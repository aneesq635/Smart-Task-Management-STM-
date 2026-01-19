import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Star, Calendar } from 'lucide-react';

export const TodayTasks = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Review quarterly goals', completed: false, important: true },
    { id: '2', title: 'Prepare for marketing sync', completed: true, important: false },
    { id: '3', title: 'Email client feedback', completed: false, important: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      important: false,
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          My Day
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* Add Task Input */}
      <div className="mb-6 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Plus className="text-blue-500" size={20} />
        </div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTask(e);
            }
          }}
          placeholder="Add a task"
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
        <div className="absolute inset-y-0 right-4 flex items-center gap-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
           <Calendar size={18} className="text-gray-400 cursor-pointer hover:text-blue-500" />
           <button onClick={addTask} className="text-sm font-medium text-blue-500 hover:text-blue-600">Add</button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="flex items-center gap-4 p-4 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 group hover:shadow-md transition-shadow"
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              {task.completed ? <CheckCircle2 className="text-green-500" size={22} /> : <Circle size={22} />}
            </button>
            <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
              {task.title}
            </span>
            <button className={`${task.important ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'} hover:text-blue-500 transition-colors`}>
              <Star size={18} fill={task.important ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-48 h-48 mb-6 opacity-20 dark:opacity-10 grayscale">
            <img src="https://picsum.photos/seed/empty/200/200" alt="Empty" className="rounded-full" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">All caught up!</h3>
          <p className="text-gray-400 dark:text-gray-500">Enjoy your productive day.</p>
        </div>
      )}
    </div>
  );
};