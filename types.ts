
export interface Hacker {
  id: string;
  alias: string;
  name: string;
  country: string;
  period: string;
  description: string;
  majorExploits: {
    year: number;
    target: string;
    method: string;
    impact: string;
  }[];
  notoriety: number;
}

export interface CTFChallenge {
  id: string;
  title: string;
  description: string;
  category: 'Web' | 'Crypto' | 'OSINT' | 'Reverse';
  points: number;
  answer: string;
}

export interface UserProfile {
  username: string;
  email: string;
  points: number;
  solvedCtfs: string[];
  readHackers: string[];
  joinedDate: string;
}

export interface Rank {
  name: string;
  minPoints: number;
  icon: string;
}

export const RANKS: Rank[] = [
  { name: 'Yangi Agent', minPoints: 0, icon: '🐣' },
  { name: 'Skript Kiddie', minPoints: 100, icon: '🤓' },
  { name: 'Kiber Qidiruvchi', minPoints: 300, icon: '🔍' },
  { name: 'Tizim Buzg\'unchisi', minPoints: 600, icon: '👺' },
  { name: 'Elite Hacker', minPoints: 1000, icon: '🧤' },
  { name: 'Kiber Prezident', minPoints: 2000, icon: '👑' },
];

export type GameStatus = 'START' | 'PLAYING' | 'GAMEOVER';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
  jumpForce: number;
  grounded: boolean;
  isSliding: boolean;
  slideTimer: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'GROUND' | 'AIR';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
