
import { UserProfile, Difficulty } from './types';

export const INITIAL_STATS = {
  totalSolved: 0,
  correctAnswers: 0,
  streak: 0,
  level: 1,
  accuracy: 0,
  skills: {
    speed: 0,
    memory: 0,
    logic: 0,
    accuracy: 0
  }
};

export const INITIAL_PROFILE: UserProfile = {
  name: "Hero",
  ageGroup: Difficulty.KIDS,
  dailyGoal: 20,
  theme: 'light',
  soundEnabled: true,
  stats: INITIAL_STATS,
  badges: []
};

export const MATH_TRICKS = [
  {
    title: "The Magic 11 🎩",
    trick: "To multiply by 11, separate the digits and put their sum in the middle! 24 x 11 = 2 (2+4) 4 = 264."
  },
  {
    title: "Flash Square ⚡",
    trick: "Square numbers ending in 5? Multiply first digit by (digit+1) and tack on 25. 35 x 35: 3x4=12, so 1225."
  },
  {
    title: "Divide by 5 🍕",
    trick: "Double the number, then shift the decimal one spot left. 145 / 5: 145x2=290 -> 29.0!"
  }
];

export const BADGES = [
  { id: 'rookie', name: 'Seedling', icon: '🌱', description: 'Solve 10 problems' },
  { id: 'streak-3', name: 'Fire Starter', icon: '🔥', description: '3 day streak' },
  { id: 'speed-demon', name: 'Thunder Bolt', icon: '⚡', description: 'Super fast solver!' },
  { id: 'master', name: 'Grand Master', icon: '👑', description: 'Reach Level 10' }
];
