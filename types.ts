
export enum Difficulty {
  KIDS = 'KIDS',
  TEEN = 'TEEN',
  ADULT = 'ADULT'
}

export enum GameMode {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  MIXED = 'MIXED',
  TEST_PREP = 'TEST_PREP',
  SEQUENCE = 'SEQUENCE',
  COMPARISON = 'COMPARISON',
  UNITS = 'UNITS'
}

export interface UserStats {
  totalSolved: number;
  correctAnswers: number;
  streak: number;
  level: number;
  accuracy: number;
  skills: {
    speed: number;
    memory: number;
    logic: number;
    accuracy: number;
  };
}

export interface UserProfile {
  name: string;
  ageGroup: Difficulty;
  dailyGoal: number;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  zenMode: boolean;
  stats: UserStats;
  badges: string[];
}

export interface MathProblem {
  id: string;
  question: string;
  answer: number;
  options: number[];
  difficulty: number;
  unitLabel?: string;
}
