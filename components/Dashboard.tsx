
import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
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
    { mode: GameMode.ADDITION, icon: '➕', label: 'ADDITION', color: 'bg-emerald-400' },
    { mode: GameMode.SUBTRACTION, icon: '➖', label: 'SUBTRACT', color: 'bg-blue-400' },
    { mode: GameMode.MULTIPLICATION, icon: '✖️', label: 'MULTIPLY', color: 'bg-orange-400' },
    { mode: GameMode.DIVISION, icon: '➗', label: 'DIVISION', color: 'bg-rose-400' },
    { mode: GameMode.TEST_PREP, icon: '📐', label: 'EXAM PREP', color: 'bg-amber-400' },
    { mode: 'DUAL', icon: '⚔️', label: '1V1 DUEL', color: 'bg-purple-400', path: '/dual' },
  ];

  return (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-bottom duration-700">
      {/* 3D Profile Card */}
      <section className="bg-white border-4 border-emerald-900 rounded-[2.5rem] p-8 shadow-[12px_12px_0_0_#064e3b] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-emerald-100 border-4 border-emerald-900 rounded-3xl flex items-center justify-center text-6xl shadow-[4px_4px_0_0_#064e3b]">
             🦁
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black text-emerald-950">Level Up, {profile.name}!</h1>
            <p className="text-emerald-700 font-extrabold uppercase tracking-widest text-sm">
              Current Rank: <span className="bg-emerald-900 text-white px-3 py-1 rounded-full">MASTER LVL {profile.stats.level}</span>
            </p>
          </div>
          <div className="flex-grow w-full md:w-auto">
            <div className="flex justify-between text-xs font-black text-emerald-900 mb-2 uppercase italic">
              <span>Goal Progress</span>
              <span>{profile.stats.totalSolved % profile.dailyGoal} / {profile.dailyGoal}</span>
            </div>
            <div className="h-8 bg-emerald-100 border-4 border-emerald-900 rounded-2xl p-1 overflow-hidden">
               <div 
                 className="h-full bg-emerald-500 rounded-xl transition-all duration-1000 border-r-4 border-emerald-700"
                 style={{ width: `${Math.min(100, (profile.stats.totalSolved % profile.dailyGoal) / profile.dailyGoal * 100)}%` }}
               />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Game Menu */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-emerald-900 flex items-center gap-3">
            <span className="p-2 bg-white border-2 border-emerald-900 rounded-lg shadow-[3px_3px_0_0_#064e3b]">🎮</span> 
            CHOOSE QUEST
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {gameTypes.map((game) => (
              <Link 
                key={game.label}
                to={game.path || `/play/${game.mode}`}
                className={`${game.color} p-6 border-4 border-emerald-950 rounded-[2rem] shadow-[6px_6px_0_0_#064e3b] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex flex-col items-center gap-3`}
              >
                <span className="text-5xl">{game.icon}</span>
                <span className="font-black text-emerald-950 text-center text-sm">{game.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Brain Stats */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-emerald-900 flex items-center gap-3">
            <span className="p-2 bg-white border-2 border-emerald-900 rounded-lg shadow-[3px_3px_0_0_#064e3b]">🧠</span> 
            BRAIN POWER
          </h2>
          <div className="bg-white border-4 border-emerald-900 rounded-[2.5rem] p-6 shadow-[10px_10px_0_0_#064e3b] h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#064e3b" strokeOpacity={0.1} strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#064e3b', fontWeight: 900, fontSize: 14 }} />
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

      {/* Trophies */}
      <section className="bg-emerald-100 border-4 border-emerald-900 rounded-[3rem] p-10 shadow-[8px_8px_0_0_#064e3b]">
        <h2 className="text-3xl font-black text-emerald-900 mb-8 flex items-center gap-3">
           <span>🏆</span> HALL OF FAME
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {BADGES.map((badge, idx) => {
            const unlocked = profile.stats.totalSolved >= (idx * 15 + 10);
            return (
              <div 
                key={badge.id} 
                className={`p-6 rounded-3xl border-4 flex flex-col items-center gap-2 transition-all ${unlocked ? 'bg-white border-emerald-900 shadow-[4px_4px_0_0_#064e3b]' : 'bg-emerald-50 border-emerald-200 grayscale opacity-40'}`}
              >
                <span className="text-5xl">{badge.icon}</span>
                <span className="font-black text-emerald-950 text-xs text-center leading-tight">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
