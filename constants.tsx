
import { Player, ScheduleEntry, Team } from './types';

export const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Nikola Jokić',
    team: 'DEN',
    position: ['C'],
    avgStats: { pts: 26.1, reb: 12.3, ast: 9.0, stl: 1.3, blk: 0.9, fgp: 58.3, ftp: 81.7, tpm: 1.1, to: 3.0 },
    catValues: { pts: 2.1, reb: 2.8, ast: 3.0, stl: 1.2, blk: 0.8, fgp: 2.5, ftp: 0.5, tpm: -0.5, to: -1.8 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/jokic/200/200',
    isProtected: true
  },
  {
    id: '2',
    name: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    position: ['PG'],
    avgStats: { pts: 30.1, reb: 5.5, ast: 6.2, stl: 2.0, blk: 0.9, fgp: 53.5, ftp: 87.4, tpm: 1.3, to: 2.2 },
    catValues: { pts: 2.8, reb: 0.2, ast: 1.5, stl: 3.0, blk: 0.8, fgp: 1.8, ftp: 2.2, tpm: -0.2, to: -0.5 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/shai/200/200',
    isProtected: true
  },
  {
    id: '3',
    name: 'Luka Dončić',
    team: 'DAL',
    position: ['PG', 'SG'],
    avgStats: { pts: 33.9, reb: 9.2, ast: 9.8, stl: 1.4, blk: 0.5, fgp: 48.7, ftp: 78.6, tpm: 4.1, to: 4.0 },
    catValues: { pts: 3.0, reb: 1.8, ast: 3.0, stl: 1.4, blk: -0.2, fgp: 0.2, ftp: -0.4, tpm: 3.0, to: -2.8 },
    status: 'Day-to-Day',
    image: 'https://picsum.photos/seed/luka/200/200',
    isProtected: false
  },
  {
    id: '4',
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    position: ['PF', 'C'],
    avgStats: { pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, fgp: 61.1, ftp: 65.7, tpm: 0.5, to: 3.4 },
    catValues: { pts: 2.9, reb: 2.5, ast: 1.6, stl: 1.1, blk: 1.4, fgp: 3.0, ftp: -3.0, tpm: -1.5, to: -2.2 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/giannis/200/200',
    isProtected: false
  },
  {
    id: '5',
    name: 'Jayson Tatum',
    team: 'BOS',
    position: ['SF', 'PF'],
    avgStats: { pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, fgp: 47.1, ftp: 83.3, tpm: 3.1, to: 2.5 },
    catValues: { pts: 2.2, reb: 1.4, ast: 0.8, stl: 0.4, blk: 0.2, fgp: -0.2, ftp: 1.2, tpm: 2.1, to: -0.8 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/tatum/200/200',
    isProtected: false
  }
];

export const MOCK_SCHEDULE: ScheduleEntry[] = [
  { week: 11, opponent: 'The Step-Backs', opponentLogo: 'https://picsum.photos/seed/team1/100/100', status: 'past', isCurrent: false, result: { score: '6-3', outcome: 'W' } },
  { week: 12, opponent: 'Logo Lillard', opponentLogo: 'https://picsum.photos/seed/team2/100/100', status: 'past', isCurrent: false, result: { score: '4-5', outcome: 'L' } },
  { week: 13, opponent: 'Triple Double Mafia', opponentLogo: 'https://picsum.photos/seed/team3/100/100', status: 'past', isCurrent: false, result: { score: '5-4', outcome: 'W' } },
  { week: 14, opponent: 'Brick City', opponentLogo: 'https://picsum.photos/seed/team4/100/100', status: 'current', isCurrent: true, strategyNote: { gamesMine: 38, gamesOpp: 40, targetCat: 'STL', threatCat: 'FG%' } },
  { week: 15, opponent: 'Sky Hookers', opponentLogo: 'https://picsum.photos/seed/team5/100/100', status: 'future', isCurrent: false, strategyNote: { gamesMine: 42, gamesOpp: 35, targetCat: 'REB', threatCat: '3PM' } },
  { week: 16, opponent: 'Dime Droppers', opponentLogo: 'https://picsum.photos/seed/team6/100/100', status: 'future', isCurrent: false, strategyNote: { gamesMine: 39, gamesOpp: 41, targetCat: 'AST', threatCat: 'BLK' } },
];

export const WAIVER_POOL: Player[] = [
  {
    id: 'w1',
    name: 'T.J. McConnell',
    team: 'IND',
    position: ['PG'],
    avgStats: { pts: 10.2, reb: 2.7, ast: 5.5, stl: 1.1, blk: 0.1, fgp: 55.6, ftp: 80.0, tpm: 0.2, to: 1.4 },
    catValues: { pts: -0.5, reb: -1.2, ast: 1.8, stl: 1.5, blk: -0.8, fgp: 1.5, ftp: 0.1, tpm: -2.0, to: 0.8 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/tj/200/200'
  },
  {
    id: 'w2',
    name: 'Grayson Allen',
    team: 'PHX',
    position: ['SG', 'SF'],
    avgStats: { pts: 13.5, reb: 3.9, ast: 3.0, stl: 0.9, blk: 0.6, fgp: 49.9, ftp: 87.8, tpm: 2.7, to: 1.1 },
    catValues: { pts: 0.2, reb: -0.5, ast: -0.2, stl: 0.5, blk: 0.2, fgp: 0.8, ftp: 1.5, tpm: 2.5, to: 1.2 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/allen/200/200'
  },
  {
    id: 'w3',
    name: 'Daniel Gafford',
    team: 'DAL',
    position: ['C'],
    avgStats: { pts: 11.0, reb: 7.6, ast: 1.6, stl: 0.6, blk: 2.1, fgp: 72.5, ftp: 70.0, tpm: 0.0, to: 1.0 },
    catValues: { pts: -0.2, reb: 1.2, ast: -1.0, stl: -0.2, blk: 3.0, fgp: 3.0, ftp: -0.8, tpm: -2.0, to: 1.4 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/gafford/200/200'
  },
  {
    id: 'w4',
    name: 'Herbert Jones',
    team: 'NOP',
    position: ['SF', 'PF'],
    avgStats: { pts: 11.0, reb: 3.6, ast: 2.6, stl: 1.4, blk: 0.8, fgp: 49.8, ftp: 86.7, tpm: 1.5, to: 1.3 },
    catValues: { pts: -0.2, reb: -0.6, ast: -0.4, stl: 2.2, blk: 0.9, fgp: 0.5, ftp: 1.2, tpm: 0.5, to: 1.0 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/herbert/200/200'
  },
  {
    id: 'w5',
    name: 'Josh Hart',
    team: 'NYK',
    position: ['SG', 'SF'],
    avgStats: { pts: 9.4, reb: 8.3, ast: 4.1, stl: 0.9, blk: 0.3, fgp: 43.4, ftp: 79.1, tpm: 1.0, to: 1.5 },
    catValues: { pts: -0.8, reb: 2.2, ast: 0.8, stl: 0.5, blk: -0.2, fgp: -1.5, ftp: -0.1, tpm: -0.5, to: 0.5 },
    status: 'Healthy',
    image: 'https://picsum.photos/seed/hart/200/200'
  }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'The Deep Web',
    owner: 'John Doe',
    rank: 1,
    record: '10-3-1',
    logo: 'https://picsum.photos/seed/deepweb/100/100',
    roster: MOCK_PLAYERS
  },
  {
    id: 't2',
    name: 'Brick City',
    owner: 'Jane Smith',
    rank: 4,
    record: '8-6-0',
    logo: 'https://picsum.photos/seed/brickcity/100/100',
    roster: [
      {
        id: 'b1',
        name: 'Anthony Edwards',
        team: 'MIN',
        position: ['SG', 'SF'],
        avgStats: { pts: 25.9, reb: 5.4, ast: 5.1, stl: 1.3, blk: 0.5, fgp: 46.1, ftp: 81.7, tpm: 2.4, to: 3.1 },
        status: 'Healthy',
        image: 'https://picsum.photos/seed/ant/200/200'
      },
      {
        id: 'b2',
        name: 'Domantas Sabonis',
        team: 'SAC',
        position: ['C'],
        avgStats: { pts: 19.4, reb: 13.1, ast: 8.2, stl: 0.9, blk: 0.6, fgp: 59.4, ftp: 70.4, tpm: 0.4, to: 3.3 },
        status: 'Healthy',
        image: 'https://picsum.photos/seed/sabonis/200/200'
      }
    ]
  },
  {
    id: 't3',
    name: 'Triple Double Mafia',
    owner: 'Mike Ross',
    rank: 2,
    record: '9-4-1',
    logo: 'https://picsum.photos/seed/mafia/100/100',
    roster: []
  },
  {
    id: 't4',
    name: 'Logo Lillard',
    owner: 'Harvey Specter',
    rank: 3,
    record: '8-5-1',
    logo: 'https://picsum.photos/seed/lillard/100/100',
    roster: []
  }
];

export const NAV_ITEMS = [
  { id: 'my-team', label: 'My Team', icon: '🏀' },
  { id: 'matchup', label: 'Live Matchup', icon: '⚔️' },
  { id: 'league', label: 'League Hub', icon: '🏆' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'players', label: 'Waiver Wire', icon: '🔍' },
  { id: 'trades', label: 'Trade Architect', icon: '🤝' },
  { id: 'ai-insights', label: 'AI Coach', icon: '🧠' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];
