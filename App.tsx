
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserProfile, Difficulty, GameMode } from './types';
import { INITIAL_PROFILE } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MathGame from './components/MathGame';
import Onboarding from './components/Onboarding';
import TricksLibrary from './components/TricksLibrary';
import DualMode from './components/DualMode';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('arithmethink_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('arithmethink_onboarded') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('arithmethink_profile', JSON.stringify(profile));
    if (profile.theme === 'dark') {
      document.body.classList.add('bg-slate-900', 'text-white');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.body.classList.remove('bg-slate-900', 'text-white');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    }
  }, [profile]);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateStats = (newStats: Partial<UserProfile['stats']>) => {
    setProfile(prev => {
      const mergedStats = { ...prev.stats, ...newStats };
      // Auto-level calculation based on correct answers
      mergedStats.level = Math.floor(mergedStats.correctAnswers / 25) + 1;
      return {
        ...prev,
        stats: mergedStats
      };
    });
  };

  if (!onboarded) {
    return <Onboarding onComplete={(config) => {
      handleUpdateProfile({
        ...config,
        stats: {
          ...INITIAL_PROFILE.stats,
          // Set initial skills based on age
          skills: config.ageGroup === Difficulty.KIDS 
            ? { speed: 10, memory: 10, logic: 10, accuracy: 10 }
            : { speed: 30, memory: 30, logic: 30, accuracy: 30 }
        }
      });
      setOnboarded(true);
      localStorage.setItem('arithmethink_onboarded', 'true');
    }} />;
  }

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900 ${profile.theme === 'dark' ? 'dark text-white' : ''}`}>
        <Header 
          profile={profile} 
          onThemeToggle={() => handleUpdateProfile({ theme: profile.theme === 'light' ? 'dark' : 'light' })} 
          onSoundToggle={() => handleUpdateProfile({ soundEnabled: !profile.soundEnabled })}
        />
        <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} />} />
            <Route path="/play/:mode" element={<MathGame profile={profile} onStatsUpdate={handleUpdateStats} />} />
            <Route path="/tricks" element={<TricksLibrary />} />
            <Route path="/dual" element={<DualMode profile={profile} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
