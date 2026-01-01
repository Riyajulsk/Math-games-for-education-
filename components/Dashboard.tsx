
import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarProps } from 'recharts';
import { UserProfile, GameMode } from '../types';
import { BADGES } from '../constants';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const chartData = [
    { subject: 'Speed', A: profile.stats.skills.speed, fullMark: 100 },
    { subject: 'Accuracy', A: profile.stats.skills.accuracy, fullMark: 100 },
    { subject: 'Logic', A: profile.stats.skills.logic, fullMark: 100 },
    { subject: 'Memory', A: profile.stats.skills.memory, fullMark: 100 },
  ];

  const gameTypes = [
    { mode: GameMode.ADDITION, icon: '🏰', label: 'CASTLE BUILDER', color: 'bg-emerald-400' },
    { mode: GameMode.SUBTRACTION, icon: '⚔️', label: 'SLIME SLAYER', color: 'bg-blue-400' },
    { mode: GameMode.MULTIPLICATION, icon: '🔋', label: 'VOLT MULTIPLY', color: 'bg-orange-400' },
    { mode: GameMode.DIVISION, icon: '🍕', label: 'PIZZA PARTY', color: 'bg-rose-400' },
    { mode: GameMode.UNITS, icon: '🛸', label: 'SPACE CARGO', color: 'bg-lime-400' },
    { mode: GameMode.SEQUENCE, icon: '🧶', label: 'CODE BREAKER', color: 'bg-indigo-400' },
    { mode: GameMode.COMPARISON, icon: '🆚', label: 'VALUE HERO', color: 'bg-yellow-400' },
    { mode: GameMode.MIXED, icon: '🌪️', label: 'TURBO MIX', color: 'bg-cyan-400' },
    { mode: 'DUAL', icon: '👑', label: 'CROWN CLASH', color: 'bg-purple-400', path: '/dual' },
  ];

  const checkUnlocked = (badge: any) => {
    switch (badge.type) {
      case 'streak': return profile.stats.streak >= badge.threshold;
      case 'skill': return profile.stats.skills.speed >= badge.threshold;
      case 'level': return profile.stats.level >= badge.threshold;
      default: return profile.stats.totalSolved >= badge.threshold;
    }
  };

  return (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-bottom duration-700">
      {/* 3D Profile Card */}
      <section className="bg-white dark:bg-slate-800 border-4 border-emerald-900 rounded-[2.5rem] p-8 shadow-[12px_12px_0_0_#064e3b] relative overflow-hidden group">
        <div className="absolute -right-8 -bottom-8 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">🐉</div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 border-4 border-emerald-900 rounded-3xl flex items-center justify-center text-6xl shadow-[4px_4px_0_0_#064e3b] animate-bounce shrink-0">
             🦁
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black text-emerald-950 dark:text-emerald-50">Hi, {profile.name}!</h1>
            <p className="text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-widest text-sm flex items-center gap-2 justify-center md:justify-start">
              Rank: <span className="bg-emerald-900 text-white px-3 py-1 rounded-full text-[10px]">LVL {profile.stats.level}</span>
            </p>
          </div>
          <div className="flex-grow w-full md:w-auto">
            <div className="flex justify-between text-xs font-black text-emerald-900 dark:text-emerald-400 mb-2 uppercase italic">
              <span>Goal Progress</span>
              <span>{profile.stats.totalSolved % profile.dailyGoal} / {profile.dailyGoal}</span>
            </div>
            <div className="h-8 bg-emerald-100 dark:bg-slate-900 border-4 border-emerald-900 rounded-2xl p-1 overflow-hidden">
               <div 
                 className="h-full bg-emerald-500 rounded-xl transition-all duration-1000 border-r-4 border-emerald-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                 style={{ width: `${Math.min(100, (profile.stats.totalSolved % profile.dailyGoal) / profile.dailyGoal * 100)}%` }}
               />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Game Menu */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 flex items-center gap-3">
            <span className="p-2 bg-white dark:bg-slate-700 border-2 border-emerald-900 rounded-lg shadow-[3px_3px_0_0_#064e3b]">🎮</span> 
            CHOOSE QUEST
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gameTypes.map((game) => (
              <Link 
                key={game.label}
                to={game.path || `/play/${game.mode}`}
                className={`${game.color} p-4 sm:p-5 border-4 border-emerald-950 rounded-[2rem] shadow-[4px_4px_0_0_#064e3b] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex flex-col items-center gap-2 hover:scale-[1.05] group`}
              >
                <div className="text-4xl transform group-hover:-rotate-12 transition-transform duration-300 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                  {game.icon}
                </div>
                <span className="font-black text-emerald-950 text-center text-[9px] tracking-tight uppercase leading-tight">
                  {game.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Brain Stats */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 flex items-center gap-3">
            <span className="p-2 bg-white dark:bg-slate-700 border-2 border-emerald-900 rounded-lg shadow-[3px_3px_0_0_#064e3b]">🧠</span> 
            BRAIN POWER
          </h2>
          <div className="bg-white dark:bg-slate-800 border-4 border-emerald-900 rounded-[2.5rem] p-6 shadow-[10px_10px_0_0_#064e3b] h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#064e3b" strokeOpacity={0.1} strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: profile.theme === 'dark' ? '#34d399' : '#064e3b', fontWeight: 900, fontSize: 14 }} />
                <Radar
                  name="Stats"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={6}
                  fill="#34d399"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trophies Section - Showing Featured Badges */}
      <section className="bg-emerald-100 dark:bg-slate-800 border-4 border-emerald-900 rounded-[3rem] p-10 shadow-[8px_8px_0_0_#064e3b]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-50 flex items-center gap-3 text-shadow-cartoon">
             <span>🏆</span> HALL OF FAME
          </h2>
          <Link to="/badges" className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-emerald-800 transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {BADGES.slice(0, 4).map((badge) => {
            const unlocked = checkUnlocked(badge);
            return (
              <div 
                key={badge.id} 
                className={`p-6 rounded-3xl border-4 flex flex-col items-center gap-2 transition-all ${unlocked ? 'bg-white dark:bg-slate-700 border-emerald-900 shadow-[4px_4px_0_0_#064e3b] scale-100' : 'bg-emerald-50 dark:bg-slate-900 border-emerald-200 dark:border-slate-700 grayscale opacity-40 scale-95'}`}
              >
                <span className="text-5xl">{badge.icon}</span>
                <span className="font-black text-emerald-950 dark:text-emerald-50 text-[10px] text-center leading-tight uppercase tracking-widest">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
