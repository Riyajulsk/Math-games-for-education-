
import React, { useState } from 'react';
import { MATH_TRICKS } from '../constants';
import { getCustomMathTrick } from '../geminiService';

const TricksLibrary: React.FC = () => {
  const [customTrick, setCustomTrick] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const handleGenerateCustom = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const result = await getCustomMathTrick(topic);
    setCustomTrick(result);
    setLoading(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section>
        <h1 className="text-3xl font-black mb-6">Mental Math Hacks ⚡</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MATH_TRICKS.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.trick}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-600 rounded-3xl p-8 text-white">
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-bold">Need a specific trick? Ask AI!</h2>
          <p className="opacity-80">Enter a topic (e.g., "Percentages" or "Squares") and our AI will generate a shortcut for you.</p>
          <div className="flex gap-2 p-2 bg-white/10 rounded-2xl">
            <input 
              type="text" 
              placeholder="e.g. 15% tips"
              className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/50 px-4 py-3"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button 
              onClick={handleGenerateCustom}
              disabled={loading}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Hacking...' : 'Generate'}
            </button>
          </div>

          {customTrick && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl text-left border border-white/20 animate-in slide-in-from-bottom duration-300">
              <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {customTrick}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TricksLibrary;
