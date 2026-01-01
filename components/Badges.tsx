
import React from 'react';
import { UserProfile } from '../types';
import { BADGES } from '../constants';

interface BadgesProps {
  profile: UserProfile;
}

const Badges: React.FC<BadgesProps> = ({ profile }) => {
  const checkUnlocked = (badge: any) => {
    switch (badge.type) {
      case 'streak': return profile.stats.streak >= badge.threshold;
      case 'skill': return profile.stats.skills.speed >= badge.threshold;
      case 'level': return profile.stats.level >= badge.threshold;
      default: return profile.stats.totalSolved >= badge.threshold;
    }
  };

  const getProgress = (badge: any) => {
    let current = 0;
    switch (badge.type) {
      case 'streak': current = profile.stats.streak; break;
      case 'skill': current = profile.stats.skills.speed; break;
      case 'level': current = profile.stats.level; break;
      default: current = profile.stats.totalSolved; break;
    }
    return Math.min(100, (current / badge.threshold) * 100);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white border-4 border-emerald-900 rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0_0_#064e3b]">
          🏆
        </div>
        <h1 className="text-4xl font-black text-emerald-950 tracking-tighter text-shadow-cartoon uppercase">Hall of Fame</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES.map((badge) => {
          const unlocked = checkUnlocked(badge);
          const progress = getProgress(badge);

          return (
            <div 
              key={badge.id}
              className={`
                relative bg-white border-4 border-emerald-950 rounded-[2.5rem] p-8 shadow-[8px_8px_0_0_#064e3b] transition-all overflow-hidden group
                ${!unlocked ? 'grayscale opacity-60' : 'hover:scale-[1.02]'}
              `}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:rotate-12 transition-transform">{badge.icon}</div>
              
              <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className={`text-6xl p-4 bg-emerald-50 rounded-full border-2 border-emerald-100 ${unlocked ? 'animate-bounce' : ''}`}>
                  {badge.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950 uppercase">{badge.name}</h3>
                  <p className="text-[10px] font-black text-emerald-600 tracking-wider uppercase">{badge.description}</p>
                </div>

                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[9px] font-black text-emerald-900 uppercase">
                    <span>Progress</span>
                    <span>{Math.floor(progress)}%</span>
                  </div>
                  <div className="h-3 bg-emerald-50 border-2 border-emerald-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-1000" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>

                {unlocked ? (
                  <span className="bg-emerald-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Unlocked</span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-emerald-200">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-400 border-4 border-emerald-900 p-8 rounded-[2.5rem] shadow-[6px_6px_0_0_#064e3b] text-center">
        <h4 className="text-2xl font-black text-emerald-950 mb-2 italic">Keep Solving to Unlock Them All!</h4>
        <p className="text-emerald-900 font-bold">The more you practice, the faster your brain grows! 🧠💥</p>
      </div>
    </div>
  );
};

export default Badges;
