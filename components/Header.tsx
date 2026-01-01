
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onThemeToggle: () => void;
  onSoundToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ profile, onThemeToggle, onSoundToggle }) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-emerald-400 border-b-4 border-emerald-900 px-4 py-3 shadow-[0_4px_0_0_#064e3b]">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white border-2 border-emerald-900 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl text-emerald-600 shadow-[4px_4px_0_0_#064e3b] group-hover:scale-110 transition-transform">
            ∑
          </div>
          <span className="font-black text-2xl text-emerald-950 tracking-tight text-shadow-cartoon">
            Arithme<span className="text-white">Think</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link to="/tricks" className={`px-4 py-2 rounded-xl text-sm font-black transition-all border-2 border-transparent ${location.pathname === '/tricks' ? 'bg-white border-emerald-900 text-emerald-700' : 'text-emerald-900 hover:bg-emerald-300'}`}>
            HACKS ⚡
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onSoundToggle}
              className="w-10 h-10 bg-white border-2 border-emerald-900 rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0_0_#064e3b] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              {profile.soundEnabled ? '🔊' : '🔇'}
            </button>
            <button 
              onClick={onThemeToggle}
              className="w-10 h-10 bg-white border-2 border-emerald-900 rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0_0_#064e3b] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              {profile.theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
