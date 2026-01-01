
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, MathProblem } from '../types';

interface DualModeProps { profile: UserProfile; }

const DualMode: React.FC<DualModeProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);

  const generateProblem = useCallback(() => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ans = a + b;
    const opts = [ans];
    while (opts.length < 4) {
      const w = ans + (Math.floor(Math.random() * 10) - 5);
      if (!opts.includes(w) && w >= 0) opts.push(w);
    }
    opts.sort(() => Math.random() - 0.5);
    setProblem({ id: Math.random().toString(), question: `${a} + ${b}`, answer: ans, options: opts, difficulty: 1 });
  }, []);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  const handleP1Answer = (val: number) => {
    if (winner !== null) return;
    if (val === problem?.answer) {
      setP1Score(s => s + 1);
      if (p1Score + 1 >= 5) setWinner(1);
      else generateProblem();
    }
  };

  const handleP2Answer = (val: number) => {
    if (winner !== null) return;
    if (val === problem?.answer) {
      setP2Score(s => s + 1);
      if (p2Score + 1 >= 5) setWinner(2);
      else generateProblem();
    }
  };

  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-emerald-50 overflow-hidden">
      {/* Top Half (Player 2 - LIME TEAM) - Rotated */}
      <div className="flex-1 rotate-180 border-b-4 border-emerald-950 flex flex-col p-6 sm:p-10 bg-lime-300">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-emerald-950 text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-tighter">LIME TEAM 🐲</div>
          <div className="text-4xl sm:text-6xl font-black text-emerald-950 drop-shadow-[4px_4px_0_#fff]">{p2Score}</div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center gap-6">
          <div className="text-5xl sm:text-8xl font-black text-emerald-950 text-center tracking-tighter text-shadow-cartoon">{problem.question}</div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {problem.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleP2Answer(opt)} 
                className="neubrutal-btn-3d bg-white py-6 rounded-[2rem] text-3xl sm:text-5xl font-black text-emerald-950 active:scale-95 transition-all shadow-[6px_6px_0_0_#064e3b]"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Divider */}
      <div className="h-4 bg-emerald-950 z-10 flex items-center justify-center relative shadow-xl">
        <button 
          onClick={() => navigate('/')}
          className="absolute neubrutal-btn-3d bg-white border-2 border-emerald-950 text-emerald-950 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg active:translate-y-0"
        >
          QUIT DUEL
        </button>
      </div>

      {/* Bottom Half (Player 1 - EMERALD TEAM) */}
      <div className="flex-1 flex flex-col p-6 sm:p-10 bg-emerald-400">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-emerald-950 text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-tighter">EMERALD TEAM 🦁</div>
          <div className="text-4xl sm:text-6xl font-black text-emerald-950 drop-shadow-[4px_4px_0_#fff]">{p1Score}</div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center gap-6">
          <div className="text-5xl sm:text-8xl font-black text-emerald-950 text-center tracking-tighter text-shadow-cartoon">{problem.question}</div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {problem.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleP1Answer(opt)} 
                className="neubrutal-btn-3d bg-white py-6 rounded-[2rem] text-3xl sm:text-5xl font-black text-emerald-950 active:scale-95 transition-all shadow-[6px_6px_0_0_#064e3b]"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {winner && (
        <div className="fixed inset-0 bg-emerald-950/90 backdrop-blur-md flex items-center justify-center p-6 z-[200]">
          <div className="bg-white border-8 border-emerald-900 rounded-[3rem] p-10 sm:p-14 text-center space-y-8 max-w-sm w-full animate-in zoom-in duration-300 shadow-[16px_16px_0_0_#34d399]">
            <div className="text-8xl animate-bounce">🏆</div>
            <div>
              <h2 className="text-4xl font-black text-emerald-950 tracking-tighter mb-2">WINNER!</h2>
              <p className="text-emerald-600 font-black text-xl">PLAYER {winner} IS THE MATH KING!</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => { setP1Score(0); setP2Score(0); setWinner(null); generateProblem(); }} 
                className="neubrutal-btn-3d w-full py-5 bg-emerald-500 text-white font-black text-2xl rounded-2xl shadow-[6px_6px_0_0_#064e3b]"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="w-full py-2 text-emerald-400 font-black text-sm uppercase tracking-widest hover:text-emerald-600 transition-colors"
              >
                GO HOME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualMode;
