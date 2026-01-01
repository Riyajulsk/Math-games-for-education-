
import React from 'react';
import { UserProfile, Difficulty } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
  const chartData = [
    { subject: 'Speed', A: profile.stats.skills.speed, fullMark: 100 },
    { subject: 'Accuracy', A: profile.stats.skills.accuracy, fullMark: 100 },
    { subject: 'Logic', A: profile.stats.skills.logic, fullMark: 100 },
    { subject: 'Memory', A: profile.stats.skills.memory, fullMark: 100 },
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset your brain? This cannot be undone! 🧠🔥")) {
      localStorage.removeItem('arithmethink_profile');
      localStorage.removeItem('arithmethink_onboarded');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white border-4 border-emerald-900 rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0_0_#064e3b]">
          👤
        </div>
        <h1 className="text-4xl font-black text-emerald-950 tracking-tighter text-shadow-cartoon uppercase">Hero Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identity Section */}
        <section className="bg-white border-4 border-emerald-900 rounded-[2.5rem] p-8 shadow-[10px_10px_0_0_#064e3b] space-y-6">
          <h2 className="text-2xl font-black text-emerald-900 border-b-4 border-emerald-50 pb-2">HERO IDENTITY</h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-emerald-700 uppercase">Hero Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={handleNameChange}
                className="w-full p-4 bg-emerald-50 border-4 border-emerald-900 rounded-2xl font-black text-emerald-950 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-emerald-700 uppercase">Skill Rank</label>
              <div className="grid grid-cols-3 gap-2">
                {[Difficulty.KIDS, Difficulty.TEEN, Difficulty.ADULT].map(diff => (
                  <button
                    key={diff}
                    onClick={() => onUpdate({ ageGroup: diff })}
                    className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${profile.ageGroup === diff ? 'bg-emerald-500 text-white border-emerald-900 shadow-[2px_2px_0_0_#064e3b]' : 'bg-white border-emerald-100 text-emerald-900 hover:border-emerald-300'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-emerald-700 uppercase">Daily Goal: {profile.dailyGoal} Solve</label>
              <input 
                type="range" min="5" max="50" step="5" value={profile.dailyGoal}
                onChange={(e) => onUpdate({ dailyGoal: parseInt(e.target.value) })}
                className="w-full h-4 bg-emerald-100 border-2 border-emerald-900 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Brain Power Chart */}
        <section className="bg-white border-4 border-emerald-900 rounded-[2.5rem] p-8 shadow-[10px_10px_0_0_#064e3b] flex flex-col items-center">
          <h2 className="text-2xl font-black text-emerald-900 border-b-4 border-emerald-50 pb-2 w-full text-center">BRAIN MAPPING</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#064e3b" strokeOpacity={0.1} strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#064e3b', fontWeight: 900, fontSize: 12 }} />
                <Radar
                  name="Stats"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill="#34d399"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs font-black text-emerald-700 uppercase tracking-widest mt-2">Level {profile.stats.level} Legend</p>
        </section>

        {/* App Settings */}
        <section className="bg-emerald-900 text-white border-4 border-emerald-950 rounded-[2.5rem] p-8 shadow-[10px_10px_0_0_#064e3b] space-y-6">
          <h2 className="text-2xl font-black border-b-4 border-emerald-800 pb-2">CONFIGS</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => onUpdate({ zenMode: !profile.zenMode })}
              className="w-full flex items-center justify-between bg-emerald-800 p-4 rounded-2xl border-2 border-emerald-700 hover:bg-emerald-700 transition-all"
            >
              <div className="text-left">
                <p className="font-black text-sm">ZEN MODE</p>
                <p className="text-[10px] opacity-70">Remove timers for relaxed play</p>
              </div>
              <div className={`w-12 h-6 rounded-full border-2 border-white relative transition-all ${profile.zenMode ? 'bg-emerald-400' : 'bg-emerald-900'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${profile.zenMode ? 'right-1' : 'left-1'}`} />
              </div>
            </button>

            <button 
              onClick={() => onUpdate({ soundEnabled: !profile.soundEnabled })}
              className="w-full flex items-center justify-between bg-emerald-800 p-4 rounded-2xl border-2 border-emerald-700 hover:bg-emerald-700 transition-all"
            >
              <div className="text-left">
                <p className="font-black text-sm">SOUND EFFECTS</p>
                <p className="text-[10px] opacity-70">Game audio cues</p>
              </div>
              <div className={`w-12 h-6 rounded-full border-2 border-white relative transition-all ${profile.soundEnabled ? 'bg-emerald-400' : 'bg-emerald-900'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${profile.soundEnabled ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
          </div>

          <button 
            onClick={resetProgress}
            className="w-full py-4 bg-rose-500 text-white border-4 border-rose-900 rounded-2xl font-black text-sm shadow-[4px_4px_0_0_#4c0519] active:translate-y-1 active:shadow-none transition-all"
          >
            DELETE BRAIN DATA 🔥
          </button>
        </section>

        {/* Statistics Recap */}
        <section className="bg-white border-4 border-emerald-900 rounded-[2.5rem] p-8 shadow-[10px_10px_0_0_#064e3b] grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-emerald-900">{profile.stats.totalSolved}</span>
            <span className="text-[10px] font-black text-emerald-700 uppercase">Solved</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-blue-900">{profile.stats.streak}</span>
            <span className="text-[10px] font-black text-blue-700 uppercase">Best Streak</span>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-orange-900">{profile.stats.correctAnswers}</span>
            <span className="text-[10px] font-black text-orange-700 uppercase">Correct</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-purple-900">{profile.stats.accuracy}%</span>
            <span className="text-[10px] font-black text-purple-700 uppercase">Accuracy</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
