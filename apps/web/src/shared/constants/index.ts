export const CACHE_TTL = {
  UPCOMING_FIXTURES: 30 * 60,
  LIVE_FIXTURES: 60,
  TODAY_FIXTURES: 5 * 60,
  HISTORICAL_STATS: 24 * 60 * 60,
  HEAD_TO_HEAD: 12 * 60 * 60,
  TRANSFERS: 24 * 60 * 60,
  LINEUPS: 5 * 60,
  PREDICTIONS: 60 * 60,
  PLAYER_STATS: 24 * 60 * 60,
  TEAM_FORM: 60 * 60,
} as const;

export const PREDICTION_WEIGHTS = {
  recentForm: 0.25,
  attackDefense: 0.20,
  homeAdvantage: 0.15,
  headToHead: 0.15,
  lineupInjuries: 0.15,
  recentTransfers: 0.05,
  oddsMarket: 0.05,
} as const;

export const SUPPORTED_LEAGUES = [
  { id: 39, name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 140, name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 61, name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: 78, name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 135, name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 94, name: 'Primeira Liga', country: 'Portugal', logo: 'https://media.api-sports.io/football/leagues/94.png' },
  { id: 71, name: 'Brasileirão Série A', country: 'Brazil', logo: 'https://media.api-sports.io/football/leagues/71.png' },
  { id: 128, name: 'Liga Profesional', country: 'Argentina', logo: 'https://media.api-sports.io/football/leagues/128.png' },
  { id: 2, name: 'UEFA Champions League', country: 'World', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  { id: 3, name: 'UEFA Europa League', country: 'World', logo: 'https://media.api-sports.io/football/leagues/3.png' },
] as const;

export const RISK_COLORS = {
  conservative: '#22c55e',
  moderate: '#f59e0b',
  aggressive: '#ef4444',
} as const;

export const CONFIDENCE_COLORS = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#22c55e',
} as const;

export const CURRENT_SEASON = 2024;
