
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
    
    let activeMode = mode as GameMode;
    if (mode === GameMode.MIXED) {
      const modes = [GameMode.ADDITION, GameMode.SUBTRACTION, GameMode.MULTIPLICATION, GameMode.DIVISION, GameMode.UNITS, GameMode.SEQUENCE, GameMode.COMPARISON];
      activeMode = modes[Math.floor(Math.random() * modes.length)];
    }

    let a = Math.floor(Math.random() * range) + 1;
    let b = Math.floor(Math.random() * range) + 1;
    let question = "";
    let answer = 0;
    let unitLabel = "";
    let options: number[] = [];

    switch (activeMode) {
      case GameMode.COMPARISON:
        const compType = Math.floor(Math.random() * 2); 
        const val1 = Math.floor(Math.random() * range) + 1;
        const val2 = Math.floor(Math.random() * range) + 1;
        if (compType === 0) {
          question = `Which is larger: ${val1} or ${val2}?`;
          answer = Math.max(val1, val2);
        } else {
          question = `Which is smaller: ${val1} or ${val2}?`;
          answer = Math.min(val1, val2);
        }
        options = [val1, val2];
        if (val1 === val2) {
           options = [val1, val1 + 1];
           answer = compType === 0 ? val1 + 1 : val1;
        }
        break;
      case GameMode.UNITS:
        const unitSubMode = Math.floor(Math.random() * 4);
        const direction = Math.random() > 0.5;
        if (unitSubMode === 0) {
          const km = Math.floor(Math.random() * 15) + 1;
          if (direction) { question = `${km} km = ? m`; answer = km * 1000; unitLabel = " m"; }
          else { question = `${km * 1000} m = ? km`; answer = km; unitLabel = " km"; }
        } else if (unitSubMode === 1) {
          const kg = Math.floor(Math.random() * 10) + 1;
          if (direction) { question = `${kg} kg = ? g`; answer = kg * 1000; unitLabel = " g"; }
          else { question = `${kg * 1000} g = ? kg`; answer = kg; unitLabel = " kg"; }
        } else if (unitSubMode === 2) {
          const L = Math.floor(Math.random() * 8) + 1;
          if (direction) { question = `${L} L = ? mL`; answer = L * 1000; unitLabel = " mL"; }
          else { question = `${L * 1000} mL = ? L`; answer = L; unitLabel = " L"; }
        } else {
          const dozens = Math.floor(Math.random() * 6) + 1;
          if (direction) { question = `${dozens} dozen = ? pcs`; answer = dozens * 12; unitLabel = " pcs"; }
          else { question = `${dozens * 12} pcs = ? doz`; answer = dozens; unitLabel = " doz"; }
        }
        break;
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
      case GameMode.SEQUENCE:
        const step = Math.floor(Math.random() * 5) + 1;
        const start = Math.floor(Math.random() * 20) + 1;
        const type = Math.random() > 0.5 ? 'add' : 'mul';
        if (type === 'add') {
          question = `${start}, ${start + step}, ${start + (step * 2)}, ?`;
          answer = start + (step * 3);
        } else {
          const factor = Math.floor(Math.random() * 2) + 2;
          question = `${start}, ${start * factor}, ${start * factor * factor}, ?`;
          answer = start * Math.pow(factor, 3);
        }
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

    if (options.length === 0) {
      options = [answer];
      while (options.length < 4) {
        let wrong;
        if (activeMode === GameMode.UNITS) {
          const distractors = [answer * 10, answer / 10, answer + 10, answer - 10, answer + 2, answer - 2];
          wrong = distractors[Math.floor(Math.random() * distractors.length)];
        } else {
          const spread = Math.max(5, Math.floor(Math.abs(answer) * 0.2) + 5);
          wrong = answer + (Math.floor(Math.random() * spread * 2) - spread);
        }
        if (!options.includes(wrong) && (activeMode === GameMode.SEQUENCE ? true : wrong >= 0)) options.push(wrong);
      }
    }
    options.sort(() => Math.random() - 0.5);
    setProblem({ id: Math.random().toString(), question, answer, options, difficulty: level, unitLabel });
    setFeedback(null);
    setSolution(null);
    setTimer(Math.max(8, (profile.ageGroup === Difficulty.KIDS ? 20 : 12) - level));
  }, [mode, difficultyLevel, profile.ageGroup]);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  useEffect(() => {
    if (profile.zenMode) return; // Disable timer in Zen Mode
    if (timer > 0 && !feedback) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
      if (timer <= 3 && timer > 0) playSound('timeup');
    } else if (timer === 0 && !feedback) {
      handleAnswer(null);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, feedback, profile.zenMode]);

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
          EXIT
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
      <div className="bg-white border-[6px] border-emerald-950 rounded-[3rem] p-10 shadow-[16px_16px_0_0_#064e3b] relative overflow-hidden group">
        {/* Progress Bar */}
        {!profile.zenMode && (
          <div className="absolute top-0 left-0 w-full h-4 bg-emerald-100">
            <div 
              className={`h-full transition-all duration-1000 border-r-4 border-emerald-900 ${timer < 4 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} 
              style={{ width: `${(timer / (profile.ageGroup === Difficulty.KIDS ? 20 : 12)) * 100}%` }}
            />
          </div>
        )}
        {profile.zenMode && (
          <div className="absolute top-0 left-0 w-full h-4 bg-blue-100 flex items-center justify-center">
            <span className="text-[10px] font-black text-blue-900 uppercase">Zen Mode Active 🧘</span>
          </div>
        )}

        <div className="text-center py-12 relative">
          <div className="absolute top-0 right-0 text-6xl opacity-20 pointer-events-none animate-bounce">
            {mode === GameMode.UNITS ? '🛸' : mode === GameMode.COMPARISON ? '🆚' : '🦁'}
          </div>
          
          {feedback === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
               <span className="text-9xl animate-ping">✨</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tighter tabular-nums mb-4 text-shadow-cartoon break-words">
            {problem.question}
          </h2>
          <div className="text-emerald-700 font-black uppercase text-xs tracking-widest italic flex items-center justify-center gap-2">
            <span>{profile.zenMode ? 'TAKE YOUR TIME' : 'READY?'}</span>
            <span className="bg-emerald-950 text-white px-2 py-0.5 rounded-full not-italic">GO!</span>
          </div>
        </div>

        {/* Arcade Buttons */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {problem.options.map((opt, i) => (
            <button
              key={i}
              disabled={feedback !== null}
              onClick={() => handleAnswer(opt)}
              className={`
                neubrutal-btn-3d py-6 sm:py-10 rounded-[2rem] font-black text-2xl sm:text-4xl
                ${feedback === null ? 'bg-white text-emerald-900 hover:bg-emerald-50' : ''}
                ${feedback === 'correct' && opt === problem.answer ? 'bg-emerald-400 text-white scale-105 z-10' : ''}
                ${feedback === 'wrong' && opt === selectedAnswerRef.current ? 'bg-rose-500 text-white' : ''}
                ${feedback === 'wrong' && opt === problem.answer ? 'bg-emerald-400 text-white animate-bounce' : ''}
                ${feedback !== null && opt !== problem.answer && opt !== selectedAnswerRef.current ? 'opacity-20 grayscale' : ''}
              `}
            >
              {opt}{problem.unitLabel}
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
               <span className="text-3xl animate-pulse">🤖</span> "HERE'S THE PLAN:"
            </h4>
            <div className="text-emerald-800 font-bold leading-relaxed whitespace-pre-wrap">{solution}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathGame;
