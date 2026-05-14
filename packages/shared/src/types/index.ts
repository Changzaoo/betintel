// ============================================================
// Core Sports Data Types - BetIntel AI
// ============================================================

export type Sport = 'football' | 'basketball' | 'tennis' | 'baseball';
export type MatchStatus = 'NS' | '1H' | 'HT' | '2H' | 'ET' | 'P' | 'FT' | 'AET' | 'PEN' | 'BT' | 'SUSP' | 'INT' | 'PST' | 'CANC' | 'ABD' | 'AWD' | 'WO' | 'LIVE';
export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type UserRole = 'free' | 'premium' | 'admin';
export type TransferType = 'buy' | 'sell' | 'loan_in' | 'loan_out' | 'free';

// ---- League / Competition ----
export interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: Country;
  season?: Season;
}

export interface Country {
  name: string;
  code?: string;
  flag?: string;
}

export interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
}

// ---- Team ----
export interface Team {
  id: number;
  name: string;
  code?: string;
  logo: string;
  country?: string;
  founded?: number;
  venue?: Venue;
}

export interface Venue {
  id?: number;
  name: string;
  city?: string;
  capacity?: number;
  surface?: string;
  image?: string;
}

// ---- Player ----
export interface Player {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  nationality?: string;
  height?: string;
  weight?: string;
  photo?: string;
  injured?: boolean;
  position?: string;
  number?: number;
}

export interface PlayerStats {
  playerId: number;
  player: Player;
  team: Team;
  league: League;
  season: number;
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    number?: number;
    position?: string;
    rating?: string;
    captain?: boolean;
  };
  substitutes: {
    in: number;
    out: number;
    bench: number;
  };
  shots: {
    total: number;
    on: number;
  };
  goals: {
    total: number;
    conceded: number;
    assists: number;
    saves?: number;
  };
  passes: {
    total: number;
    key: number;
    accuracy: number;
  };
  tackles: {
    total: number;
    blocks: number;
    interceptions: number;
  };
  duels: {
    total: number;
    won: number;
  };
  dribbles: {
    attempts: number;
    success: number;
    past?: number;
  };
  fouls: {
    drawn: number;
    committed: number;
  };
  cards: {
    yellow: number;
    yellowred: number;
    red: number;
  };
  penalty: {
    won?: number;
    commited?: number;
    scored: number;
    missed: number;
    saved?: number;
  };
}

// ---- Fixture / Match ----
export interface Fixture {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
  venue?: Venue;
  status: {
    long: string;
    short: MatchStatus;
    elapsed?: number;
  };
  league: League;
  teams: {
    home: Team & { winner?: boolean };
    away: Team & { winner?: boolean };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score?: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
  events?: MatchEvent[];
}

export interface MatchEvent {
  time: { elapsed: number; extra?: number };
  team: Team;
  player: { id: number; name: string };
  assist?: { id?: number; name?: string };
  type: string;
  detail: string;
  comments?: string;
}

// ---- Match Statistics ----
export interface MatchStatistics {
  fixtureId: number;
  teams: {
    home: TeamMatchStats;
    away: TeamMatchStats;
  };
}

export interface TeamMatchStats {
  team: Team;
  statistics: StatItem[];
}

export interface StatItem {
  type: string;
  value: string | number | null;
}

// ---- Team Form ----
export interface TeamForm {
  teamId: number;
  team: Team;
  last5: FormSummary;
  last10: FormSummary;
  last15: FormSummary;
  recentMatches: RecentMatch[];
  homeRecord: FormRecord;
  awayRecord: FormRecord;
}

export interface FormSummary {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  avgCorners: number;
  avgFouls: number;
  avgShots: number;
  avgShotsOnTarget: number;
  avgYellowCards: number;
  avgRedCards: number;
  winRate: number;
  form: string;
  currentStreak: string;
}

export interface FormRecord {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface RecentMatch {
  fixtureId: number;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  result: 'W' | 'D' | 'L';
  isHome: boolean;
  league: League;
  stats?: {
    corners: number;
    fouls: number;
    shots: number;
    shotsOnTarget: number;
    yellowCards: number;
    redCards: number;
  };
}

// ---- Head to Head ----
export interface HeadToHead {
  teamA: Team;
  teamB: Team;
  totalMatches: number;
  teamAWins: number;
  draws: number;
  teamBWins: number;
  avgGoals: number;
  avgCorners: number;
  avgFouls: number;
  bttsRate: number;
  over15Rate: number;
  over25Rate: number;
  matches: H2HMatch[];
}

export interface H2HMatch {
  fixtureId: number;
  date: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  winner?: Team;
  stats?: {
    corners?: number;
    fouls?: number;
    shots?: number;
    shotsOnTarget?: number;
    yellowCards?: number;
    redCards?: number;
  };
  scorers?: GoalScorer[];
}

export interface GoalScorer {
  player: Player;
  team: Team;
  goals: number;
  assists?: number;
}

// ---- Lineup ----
export interface Lineup {
  fixtureId: number;
  isOfficial: boolean;
  lastUpdated: string;
  home: TeamLineup;
  away: TeamLineup;
}

export interface TeamLineup {
  team: Team;
  formation: string;
  coach: Coach;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
  injured: LineupPlayer[];
  suspended: LineupPlayer[];
  doubtful: LineupPlayer[];
}

export interface LineupPlayer {
  player: Player;
  position: string;
  grid?: string;
  number?: number;
}

export interface Coach {
  id?: number;
  name: string;
  photo?: string;
}

// ---- Transfer ----
export interface Transfer {
  player: Player;
  type: TransferType;
  date: string;
  fromTeam?: Team;
  toTeam?: Team;
  fee?: string;
  impact?: 'high' | 'medium' | 'low';
}

// ---- Odds ----
export interface Odds {
  fixtureId: number;
  bookmaker?: string;
  markets: OddsMarket[];
  updatedAt: string;
}

export interface OddsMarket {
  name: string;
  values: OddsValue[];
}

export interface OddsValue {
  value: string;
  odd: string;
}

// ---- Prediction ----
export interface Prediction {
  fixtureId: number;
  generatedAt: string;
  confidenceScore: number;
  riskLevel: RiskLevel;
  probabilities: PredictionProbabilities;
  trends: PredictionTrend[];
  summary: string;
  disclaimer: string;
  sourceData: PredictionSourceData;
}

export interface PredictionProbabilities {
  homeWin: number;
  draw: number;
  awayWin: number;
  over15Goals: number;
  over25Goals: number;
  btts: number;
  moreCorners: 'home' | 'away' | 'even';
  moreFouls: 'home' | 'away' | 'even';
  moreShotsOnTarget: 'home' | 'away' | 'even';
  moreCards: 'home' | 'away' | 'even';
}

export interface PredictionTrend {
  market: string;
  label: string;
  probability: number;
  confidence: ConfidenceLevel;
  risk: RiskLevel;
  reasoning: string;
  dataPoints: string[];
}

export interface PredictionSourceData {
  homeFormLast5: FormSummary;
  awayFormLast5: FormSummary;
  headToHead: HeadToHead;
  weights: PredictionWeights;
}

export interface PredictionWeights {
  recentForm: number;
  attackDefense: number;
  homeAdvantage: number;
  headToHead: number;
  lineupInjuries: number;
  recentTransfers: number;
  oddsMarket: number;
}

// ---- Full Match Analysis ----
export interface MatchAnalysis {
  fixture: Fixture;
  homeForm: TeamForm;
  awayForm: TeamForm;
  headToHead: HeadToHead;
  lineup?: Lineup;
  homeTransfers: Transfer[];
  awayTransfers: Transfer[];
  homePlayerStats: PlayerStats[];
  awayPlayerStats: PlayerStats[];
  odds?: Odds;
  prediction: Prediction;
  generatedAt: string;
}

// ---- User ----
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  plan: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  fixtureId?: number;
  teamId?: number;
  leagueId?: number;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  fixtureId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ---- API Responses ----
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    cachedAt?: string;
    expiresAt?: string;
    source?: string;
    isMock?: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ---- Filters ----
export interface FixtureFilters {
  leagueId?: number;
  teamId?: number;
  country?: string;
  date?: string;
  status?: MatchStatus | 'all';
  search?: string;
}
