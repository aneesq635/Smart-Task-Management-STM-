import React, { useState } from 'react';
import { X, Brain, Sparkles, Loader2, Bell } from 'lucide-react';

export const AddReminderModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(2); // MEDIUM
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mode, setMode] = useState('manual');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, description, priority, date, time });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(2); // MEDIUM
    setDate(new Date().toISOString().split('T')[0]);
    setTime('12:00');
    setAiInput('');
  };

  const handleAiSuggest = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    try {
      // Replace with your AI service call
      // const suggestions = await suggestRemindersFromText(aiInput);
      // if (suggestions.length > 0) {
      //   const s = suggestions[0];
      //   setTitle(s.title);
      //   setDescription(s.description);
      //   setPriority(s.priority);
      //   setDate(s.date);
      //   setTime(s.time);
      //   setMode('manual');
      // }
      console.log('AI suggestion for:', aiInput);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const Priority = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {mode === 'manual' ? 'New Reminder' : 'AI Quick Add'}
            {mode === 'manual' ? <Bell className="text-blue-500" size={20} /> : <Brain className="text-purple-500" size={20} />}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button 
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'manual' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manual
            </button>
            <button 
              onClick={() => setMode('ai')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'ai' ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700'}`}
            >
              AI Assistant
            </button>
          </div>

          {mode === 'ai' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Describe your reminder naturally, like "Call Mike tomorrow at 3pm about the budget".
              </p>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Type your reminder here..."
                className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white resize-none"
              />
              <button
                disabled={isAiLoading || !aiInput.trim()}
                onClick={handleAiSuggest}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-200 dark:shadow-none"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                Generate Smart Reminder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="Review monthly budget..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white h-20 resize-none"
                  placeholder="Details about the task..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <div className="flex gap-2">
                  {[Priority.HIGH, Priority.MEDIUM, Priority.LOW].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                        priority === p 
                          ? p === Priority.HIGH ? 'border-red-500 bg-red-50 text-red-600' : p === Priority.MEDIUM ? 'border-yellow-500 bg-yellow-50 text-yellow-600' : 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-transparent bg-gray-100 text-gray-500 dark:bg-gray-800'
                      }`}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl mt-4 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
              >
                Add Reminder
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};