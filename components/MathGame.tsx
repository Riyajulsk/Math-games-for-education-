
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserProfile, GameMode, MathProblem, Difficulty } from '../types';
import { getStepByStepSolution } from '../geminiService';

interface MathGameProps {
  profile: UserProfile;
  onStatsUpdate: (stats: Partial<UserProfile['stats']>) => void;
}

const MathGame: React.FC<MathGameProps> = ({ profile, onStatsUpdate }) => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timer, setTimer] = useState(30);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [solution, setSolution] = useState<string | null>(null);
  const [loadingSolution, setLoadingSolution] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedAnswerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = (type: 'success' | 'error' | 'timeup') => {
    if (!profile.soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'timeup') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) { console.warn(e); }
  };

  const generateProblem = useCallback(() => {
    let baseRange = 10;
    if (profile.ageGroup === Difficulty.TEEN) baseRange = 30;
    if (profile.ageGroup === Difficulty.ADULT) baseRange = 100;
    const level = difficultyLevel;
    const range = baseRange + (level * 5);
    let a = Math.floor(Math.random() * range) + 1;
    let b = Math.floor(Math.random() * range) + 1;
    let question = "";
    let answer = 0;
    switch (mode) {
      case GameMode.SUBTRACTION:
        if (a < b) [a, b] = [b, a];
        question = `${a} - ${b}`;
        answer = a - b;
        break;
      case GameMode.MULTIPLICATION:
        a = Math.floor(Math.random() * (level + (profile.ageGroup === Difficulty.KIDS ? 6 : 12))) + 1;
        b = Math.floor(Math.random() * (level + (profile.ageGroup === Difficulty.KIDS ? 6 : 12))) + 1;
        question = `${a} × ${b}`;
        answer = a * b;
        break;
      case GameMode.DIVISION:
        b = Math.floor(Math.random() * (level + 5)) + 1;
        answer = Math.floor(Math.random() * (level + 5)) + 1;
        a = b * answer;
        question = `${a} ÷ ${b}`;
        break;
      case GameMode.TEST_PREP:
        const n = Math.floor(Math.random() * 15) + 1;
        question = `√${n * n}`;
        answer = n;
        break;
      default:
        question = `${a} + ${b}`;
        answer = a + b;
    }
    const options = [answer];
    while (options.length < 4) {
      const spread = Math.max(5, Math.floor(Math.abs(answer) * 0.2) + 5);
      const wrong = answer + (Math.floor(Math.random() * spread * 2) - spread);
      if (!options.includes(wrong) && wrong >= 0) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    setProblem({ id: Math.random().toString(), question, answer, options, difficulty: level });
    setFeedback(null);
    setSolution(null);
    setTimer(Math.max(8, (profile.ageGroup === Difficulty.KIDS ? 20 : 12) - level));
  }, [mode, difficultyLevel, profile.ageGroup]);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  useEffect(() => {
    if (timer > 0 && !feedback) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
      if (timer <= 3 && timer > 0) playSound('timeup');
    } else if (timer === 0 && !feedback) {
      handleAnswer(null);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, feedback]);

  const handleAnswer = (val: number | null) => {
    if (feedback !== null) return;
    selectedAnswerRef.current = val;
    const isCorrect = val === problem?.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    playSound(isCorrect ? 'success' : 'error');
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 50 : 150);
    
    if (isCorrect) {
      const newStreak = sessionStreak + 1;
      setSessionStreak(newStreak);
      if (newStreak % 5 === 0) setDifficultyLevel(l => l + 1);
      onStatsUpdate({
        totalSolved: profile.stats.totalSolved + 1,
        correctAnswers: profile.stats.correctAnswers + 1,
        streak: Math.max(profile.stats.streak, newStreak),
        skills: {
          ...profile.stats.skills,
          speed: Math.min(100, profile.stats.skills.speed + 2),
          accuracy: Math.min(100, profile.stats.skills.accuracy + 2)
        }
      });
    } else {
      setSessionStreak(0);
      onStatsUpdate({ totalSolved: profile.stats.totalSolved + 1 });
    }
    setTimeout(() => { generateProblem(); }, 1200);
  };

  const handleShowSolution = async () => {
    if (!problem) return;
    setLoadingSolution(true);
    const text = await getStepByStepSolution(problem.question, problem.answer);
    setSolution(text);
    setLoadingSolution(false);
  };

  if (!problem) return null;

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 pt-4">
      {/* HUD */}
      <div className="flex items-center justify-between px-2">
        <button onClick={() => navigate('/')} className="neubrutal-btn-3d px-6 py-2 bg-white text-emerald-900 font-black rounded-xl">
          BACK
        </button>
        <div className="flex gap-3">
          <div className="bg-orange-400 border-4 border-emerald-900 px-4 py-2 rounded-2xl font-black text-emerald-950 shadow-[4px_4px_0_0_#064e3b]">
             🔥 {sessionStreak}
          </div>
          <div className="bg-emerald-400 border-4 border-emerald-900 px-4 py-2 rounded-2xl font-black text-emerald-950 shadow-[4px_4px_0_0_#064e3b]">
             LVL {difficultyLevel}
          </div>
        </div>
      </div>

      {/* Arcade Screen */}
      <div className="bg-white border-[6px] border-emerald-950 rounded-[3rem] p-10 shadow-[16px_16px_0_0_#064e3b] relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-4 bg-emerald-100">
          <div 
            className={`h-full transition-all duration-1000 border-r-4 border-emerald-900 ${timer < 4 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} 
            style={{ width: `${(timer / (profile.ageGroup === Difficulty.KIDS ? 20 : 12)) * 100}%` }}
          />
        </div>

        <div className="text-center py-12 relative">
          <div className="absolute top-0 right-0 text-6xl opacity-20 pointer-events-none">🐼</div>
          <div className="absolute bottom-0 left-0 text-6xl opacity-20 pointer-events-none">🦁</div>
          
          {feedback === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
               <span className="text-9xl animate-ping">✨</span>
            </div>
          )}

          <h2 className="text-6xl sm:text-8xl font-black text-emerald-950 tracking-tighter tabular-nums mb-4 text-shadow-cartoon">
            {problem.question}
          </h2>
          <div className="text-emerald-700 font-black uppercase text-sm tracking-widest italic">Pick the winner!</div>
        </div>

        {/* Arcade Buttons */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {problem.options.map((opt, i) => (
            <button
              key={i}
              disabled={feedback !== null}
              onClick={() => handleAnswer(opt)}
              className={`
                neubrutal-btn-3d py-6 sm:py-10 rounded-[2rem] font-black text-3xl sm:text-5xl
                ${feedback === null ? 'bg-white text-emerald-900 hover:bg-emerald-50' : ''}
                ${feedback === 'correct' && opt === problem.answer ? 'bg-emerald-400 text-white scale-105 z-10' : ''}
                ${feedback === 'wrong' && opt === selectedAnswerRef.current ? 'bg-rose-500 text-white' : ''}
                ${feedback === 'wrong' && opt === problem.answer ? 'bg-emerald-400 text-white animate-bounce' : ''}
                ${feedback !== null && opt !== problem.answer && opt !== selectedAnswerRef.current ? 'opacity-20 grayscale' : ''}
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Helper Bot */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={handleShowSolution}
          disabled={loadingSolution}
          className="neubrutal-btn-3d bg-blue-400 py-5 rounded-3xl font-black text-white flex items-center justify-center gap-3 text-xl shadow-[6px_6px_0_0_#1e3a8a]"
        >
          {loadingSolution ? '🤖 SCANNING...' : '💡 ASK THE ROBOT'}
        </button>
        
        {solution && (
          <div className="bg-emerald-50 border-4 border-emerald-900 p-8 rounded-[2.5rem] shadow-[8px_8px_0_0_#064e3b] animate-in zoom-in duration-300">
            <h4 className="font-black text-emerald-900 mb-3 flex items-center gap-3 text-xl">
               <span className="text-3xl">🤖</span> "HERE'S THE PLAN:"
            </h4>
            <p className="text-emerald-800 font-bold leading-relaxed">{solution}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathGame;
