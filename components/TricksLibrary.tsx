
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-12">
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-400 border-4 border-emerald-900 rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0_0_#064e3b]">
            📜
          </div>
          <div>
            <h1 className="text-4xl font-black text-emerald-950 tracking-tighter text-shadow-cartoon">HALL OF HACKS</h1>
            <p className="text-emerald-700 font-bold italic">Master the secrets of the math ancients!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MATH_TRICKS.map((item, idx) => (
            <div key={idx} className="neubrutal-card bg-white p-8 rounded-[2.5rem] flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{item.title}</h3>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-bold text-lg">{item.trick}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Wizard Section */}
      <section className="bg-emerald-400 border-[6px] border-emerald-900 rounded-[3rem] p-10 shadow-[12px_12px_0_0_#064e3b]">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">THE MAGIC LAB 🧪</h2>
            <p className="text-emerald-900 font-bold">Ask the Math Wizard for a custom shortcut!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border-4 border-emerald-900 rounded-[2rem] shadow-[6px_6px_0_0_#064e3b]">
            <input 
              type="text" 
              placeholder="e.g. 'Multiplying by 9'..."
              className="flex-grow bg-transparent border-none outline-none text-emerald-950 placeholder-emerald-300 px-4 py-4 font-black text-xl"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button 
              onClick={handleGenerateCustom}
              disabled={loading}
              className="neubrutal-btn-3d bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-[4px_4px_0_0_#064e3b] disabled:opacity-50"
            >
              {loading ? '🔮 BREWING...' : 'CREATE!'}
            </button>
          </div>

          {customTrick && (
            <div className="bg-emerald-50 border-4 border-emerald-900 p-8 rounded-[2.5rem] shadow-[8px_8px_0_0_#064e3b] text-left animate-in zoom-in duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✨</span>
                <span className="font-black text-emerald-900 uppercase tracking-widest text-sm italic">New Secret Unlocked</span>
              </div>
              <div className="text-emerald-950 font-bold text-lg leading-relaxed whitespace-pre-wrap">
                {customTrick}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Math Buddy Suggestion */}
      <div className="flex items-center justify-center gap-4 bg-white border-2 border-emerald-900 p-6 rounded-[2rem] shadow-[4px_4px_0_0_#064e3b]">
        <span className="text-4xl">🤖</span>
        <p className="text-emerald-800 font-black italic">"I'm scanning for more shortcuts! Keep practicing!"</p>
      </div>
    </div>
  );
};

export default TricksLibrary;
