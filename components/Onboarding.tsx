
import React, { useState } from 'react';
import { Difficulty, UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (config: Partial<UserProfile>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<Difficulty>(Difficulty.KIDS);
  const [goal, setGoal] = useState(20);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ name, ageGroup, dailyGoal: goal });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-50">
      <div className="max-w-md w-full bg-white border-4 border-emerald-900 rounded-[3rem] p-10 shadow-[16px_16px_0_0_#064e3b] space-y-10 animate-in zoom-in duration-500">
        <div className="flex justify-between items-center bg-emerald-100 p-4 rounded-3xl border-2 border-emerald-900">
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-4 border-2 border-emerald-900 rounded-full transition-all duration-500 ${s <= step ? 'bg-emerald-500 w-12' : 'bg-white w-6'}`} />
            ))}
          </div>
          <span className="font-black text-emerald-900">QUEST {step}/3</span>
        </div>

        {step === 1 && (
          <div className="space-y-8 text-center">
            <div className="text-8xl animate-bounce">🦖</div>
            <div>
              <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tighter">WHO ARE YOU?</h1>
              <p className="text-emerald-700 font-bold">Pick a hero name for your math journey!</p>
            </div>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YOUR HERO NAME..."
              className="w-full p-6 rounded-2xl bg-emerald-50 border-4 border-emerald-900 outline-none text-2xl font-black text-center placeholder-emerald-300 focus:bg-white transition-all"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tighter">SELECT RANK</h1>
              <p className="text-emerald-700 font-bold">How tough are the puzzles?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'ROOKIE', val: Difficulty.KIDS, icon: '🐣', desc: 'Easy & Chill' },
                { label: 'HERO', val: Difficulty.TEEN, icon: '🐺', desc: 'Quick & Sharp' },
                { label: 'LEGEND', val: Difficulty.ADULT, icon: '🐲', desc: 'Brain Burners' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setAgeGroup(opt.val)}
                  className={`p-6 rounded-3xl border-4 flex items-center gap-5 transition-all active:scale-95 ${ageGroup === opt.val ? 'border-emerald-900 bg-emerald-400 shadow-[4px_4px_0_0_#064e3b]' : 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50'}`}
                >
                  <span className="text-5xl">{opt.icon}</span>
                  <div className="text-left">
                    <div className="font-black text-emerald-950 text-xl">{opt.label}</div>
                    <div className="text-sm text-emerald-700 font-bold">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center">
            <div>
              <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tighter">DAILY GOAL 🏆</h1>
              <p className="text-emerald-700 font-bold">How many challenges today?</p>
            </div>
            <div className="space-y-6 py-6">
              <span className="text-8xl font-black text-emerald-600 drop-shadow-[4px_4px_0_#064e3b]">{goal}</span>
              <input 
                type="range" min="5" max="50" step="5" value={goal}
                onChange={(e) => setGoal(parseInt(e.target.value))}
                className="w-full h-8 bg-emerald-100 border-4 border-emerald-900 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between font-black text-emerald-900 text-xs">
                <span>RELAXED</span>
                <span>CHALLENGE</span>
                <span>GOD MODE</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={step === 1 && !name.trim()}
          className="neubrutal-btn-3d w-full py-6 bg-emerald-500 text-white rounded-3xl font-black text-2xl shadow-[8px_8px_0_0_#064e3b] disabled:opacity-50"
        >
          {step === 3 ? "START QUEST!" : "NEXT →"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
