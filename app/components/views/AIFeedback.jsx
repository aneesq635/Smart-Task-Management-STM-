import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Lightbulb, Zap, Send, Loader2 } from 'lucide-react';

export const AIFeedback = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const suggestions = [
    "How can I improve my task prioritization?",
    "Show me patterns in my procrastination",
    "Help me break down 'Project Phoenix'",
    "Suggest a routine based on my energy levels"
  ];

  const handleSend = async (customQuery) => {
    const textToSubmit = customQuery || query;
    if (!textToSubmit.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { 
              role: "user", 
              content: `You are TaskFlow AI, a world-class productivity coach. Analyze the user's query and provide concise, actionable, and encouraging feedback. Use professional yet approachable language.\n\nUser query: ${textToSubmit}` 
            }
          ],
        })
      });

      const data = await response.json();
      const responseText = data.content
        .map(item => (item.type === "text" ? item.text : ""))
        .filter(Boolean)
        .join("\n");
      
      setAiResponse(responseText || "I'm sorry, I couldn't generate a response. Please try again.");
    } catch (error) {
      console.error("AI Coaching Error:", error);
      setAiResponse("I encountered an issue connecting to the AI coach. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <header className="text-center mb-12">
        <div className="inline-flex p-4 bg-blue-500/10 rounded-3xl mb-6">
          <Sparkles className="text-blue-500 w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">TaskFlow AI</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Unlock your potential with personalized productivity coaching.
        </p>
      </header>

      {/* Suggestion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {suggestions.map((text, i) => (
          <button 
            key={i}
            onClick={() => {
              setQuery(text);
              handleSend(text);
            }}
            disabled={isLoading}
            className="text-left p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg group disabled:opacity-50"
          >
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb size={18} className="text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-500">Coach Insight</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{text}</p>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 p-2 overflow-hidden flex items-center">
        <textarea
          rows={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask TaskFlow AI anything about your productivity..."
          className="flex-1 bg-transparent px-6 py-4 resize-none focus:outline-none text-gray-800 dark:text-gray-100"
        />
        <button 
          onClick={() => handleSend()}
          disabled={isLoading || !query.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center min-w-[56px]"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>

      <div className="mt-12 space-y-6">
        {aiResponse ? (
          <div className="flex gap-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BrainCircuit className="text-blue-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300">AI Coach Response</h4>
              <div className="text-sm text-blue-800 dark:text-blue-400/80 mt-2 leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>
          </div>
        ) : (
          !isLoading && (
            <>
              <div className="flex gap-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
                <BrainCircuit className="text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300">Observation from this week</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400/80 mt-2 leading-relaxed">
                    You tend to complete 40% more tasks between 9:00 AM and 11:30 AM. However, your energy dips significantly on Tuesdays. Consider front-loading your deep work to early Monday and Thursday for maximum impact.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl border border-yellow-100 dark:border-yellow-900/20">
                <Zap className="text-yellow-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-300">Quick Tip</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-400/80 mt-2">
                    Break down "Review quarterly goals" into 3 smaller sub-tasks. Models show this increases your completion probability by 22%.
                  </p>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};