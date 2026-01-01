
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900 overflow-hidden">
      {/* Top Half (Player 2) - Rotated */}
      <div className="flex-1 rotate-180 border-b-2 border-slate-700 flex flex-col p-4 sm:p-8 bg-indigo-900/50">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <div className="text-white font-bold text-xs sm:text-base">Player 2</div>
          <div className="text-2xl sm:text-4xl font-black text-white">{p2Score}</div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-8">
          <div className="text-4xl sm:text-6xl font-black text-white text-center">{problem.question}</div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm">
            {problem.options.map((opt, i) => (
              <button key={i} onClick={() => handleP2Answer(opt)} className="bg-white/10 hover:bg-white/20 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-bold text-white active:scale-95 transition-all">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Bar */}
      <div className="h-1 bg-yellow-400 shadow-xl z-10 flex items-center justify-center relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute bg-white text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap"
        >
          Exit
        </button>
      </div>

      {/* Bottom Half (Player 1) */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 bg-blue-900/50">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <div className="text-white font-bold text-xs sm:text-base">Player 1</div>
          <div className="text-2xl sm:text-4xl font-black text-white">{p1Score}</div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-8">
          <div className="text-4xl sm:text-6xl font-black text-white text-center">{problem.question}</div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm">
            {problem.options.map((opt, i) => (
              <button key={i} onClick={() => handleP1Answer(opt)} className="bg-white/10 hover:bg-white/20 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-bold text-white active:scale-95 transition-all">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {winner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-[200]">
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center space-y-4 sm:space-y-6 max-w-sm w-full animate-in zoom-in duration-300">
            <div className="text-5xl sm:text-7xl">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Player {winner} Wins!</h2>
            <button onClick={() => { setP1Score(0); setP2Score(0); setWinner(null); generateProblem(); }} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl">Play Again</button>
            <button onClick={() => navigate('/')} className="w-full py-2 text-slate-400 font-bold text-sm">Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualMode;
