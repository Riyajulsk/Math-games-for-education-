
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
  zenMode: false,
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
    title: "The Metric 1000 ⚖️",
    trick: "kg to gram? liter to milliliter? km to meter? It's always 1000! Just add three zeros or move the decimal 3 spots right."
  },
  {
    title: "The Dozen Hack 📦",
    trick: "1 dozen = 12. 5 dozens? 5 x 10 + 5 x 2 = 60. To find pieces, multiply dozens by 12!"
  },
  {
    title: "Divide by 5 🍕",
    trick: "Double the number, then shift the decimal one spot left. 145 / 5: 145x2=290 -> 29.0!"
  }
];

export const BADGES = [
  { id: 'rookie', name: 'Seedling', icon: '🌱', description: 'Solve 10 problems', threshold: 10 },
  { id: 'streak-3', name: 'Fire Starter', icon: '🔥', description: 'Maintain a 3-win streak', threshold: 3, type: 'streak' },
  { id: 'veteran', name: 'Math Warrior', icon: '⚔️', description: 'Solve 50 problems', threshold: 50 },
  { id: 'speed-demon', name: 'Thunder Bolt', icon: '⚡', description: 'Reach 80% Speed skill', threshold: 80, type: 'skill' },
  { id: 'brainiac', name: 'Brainiac', icon: '🔬', description: 'Reach Level 5', threshold: 5, type: 'level' },
  { id: 'master', name: 'Grand Master', icon: '👑', description: 'Reach Level 10', threshold: 10, type: 'level' }
];
