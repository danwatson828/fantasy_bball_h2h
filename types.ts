
export interface Player {
  id: string;
  name: string;
  team: string;
  position: string[];
  avgStats: {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    fgp: number;
    ftp: number;
    tpm: number;
    to: number;
  };
  catValues?: {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    fgp: number;
    ftp: number;
    tpm: number;
    to: number;
  };
  status: 'Healthy' | 'Questionable' | 'Out' | 'Day-to-Day';
  image: string;
  isProtected?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  rank: number;
  record: string;
  roster: Player[];
  logo: string;
}

export interface TradeSuggestion {
  targetPlayerName: string;
  assetToGiveName: string;
  synergyScore: number; // 1-100
  categoryImpacts: {
    category: string;
    delta: number;
    isImprovement: boolean;
  }[];
  thePitch: string;
  negotiationDifficulty: 'Easy' | 'Fair' | 'Hard';
}

export interface LeagueConfig {
  leagueId: string;
  seasonId: string;
  espnS2?: string;
  swid?: string;
  isPrivate: boolean;
}

export interface ScheduleEntry {
  week: number;
  opponent: string;
  opponentLogo: string;
  result?: {
    score: string;
    outcome: 'W' | 'L' | 'D';
  };
  isCurrent: boolean;
  status: 'past' | 'current' | 'future';
  strategyNote?: {
    gamesMine: number;
    gamesOpp: number;
    targetCat: string;
    threatCat: string;
  };
}

export type AppSection = 'my-team' | 'matchup' | 'schedule' | 'players' | 'trades' | 'ai-insights' | 'league' | 'settings';
