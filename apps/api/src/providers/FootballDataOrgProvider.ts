/**
 * football-data.org provider — completamente gratuito, sem limite diário.
 * Registro: https://www.football-data.org/client/register
 * Documentação: https://www.football-data.org/documentation/api
 *
 * Plano gratuito inclui:
 *  - Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League
 *  - Brasileirão Série A (competitionId: BSA)
 *  - Fixtures, resultados, standings, squads, jogadores
 *  - 10 requisições por minuto
 */

import axios, { AxiosInstance } from 'axios';
import {
  Fixture, TeamForm, HeadToHead, Lineup, Transfer,
  PlayerStats, League, FixtureFilters, RecentMatch
} from '@betintel/shared';
import { SportsDataProvider } from './SportsDataProvider';
import { logger } from '../utils/logger';

// Mapeamento das ligas football-data.org → nosso formato
const LEAGUE_MAP: Record<number, { fdId: string; name: string; country: string; logo: string }> = {
  39:  { fdId: 'PL',  name: 'Premier League',       country: 'England', logo: 'https://crests.football-data.org/PL.png' },
  140: { fdId: 'PD',  name: 'La Liga',               country: 'Spain',   logo: 'https://crests.football-data.org/PD.png' },
  78:  { fdId: 'BL1', name: 'Bundesliga',             country: 'Germany', logo: 'https://crests.football-data.org/BL1.png' },
  135: { fdId: 'SA',  name: 'Serie A',                country: 'Italy',   logo: 'https://crests.football-data.org/SA.png' },
  61:  { fdId: 'FL1', name: 'Ligue 1',                country: 'France',  logo: 'https://crests.football-data.org/FL1.png' },
  2:   { fdId: 'CL',  name: 'Champions League',       country: 'Europe',  logo: 'https://crests.football-data.org/CL.png' },
  71:  { fdId: 'BSA', name: 'Brasileirão Série A',    country: 'Brazil',  logo: 'https://crests.football-data.org/BSA.png' },
  94:  { fdId: 'PPL', name: 'Primeira Liga',          country: 'Portugal', logo: 'https://crests.football-data.org/PPL.png' },
};

// Reverso: fdId → nosso leagueId
const FD_TO_LEAGUE_ID: Record<string, number> = Object.fromEntries(
  Object.entries(LEAGUE_MAP).map(([k, v]) => [v.fdId, Number(k)])
);

export class FootballDataOrgProvider implements SportsDataProvider {
  name = 'football-data.org';
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FOOTBALL_DATA_ORG_KEY ?? '';
    this.client = axios.create({
      baseURL: 'https://api.football-data.org/v4',
      headers: { 'X-Auth-Token': this.apiKey },
      timeout: 12000,
    });
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  private async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const res = await this.client.get<T>(path, { params });
    return res.data;
  }

  async getUpcomingFixtures(filters?: FixtureFilters): Promise<Fixture[]> {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const dateFrom = today.toISOString().split('T')[0];
    const dateTo = nextWeek.toISOString().split('T')[0];

    const params: Record<string, unknown> = { dateFrom, dateTo, status: 'SCHEDULED' };

    if (filters?.leagueId && LEAGUE_MAP[filters.leagueId]) {
      params.competitions = LEAGUE_MAP[filters.leagueId].fdId;
    } else {
      params.competitions = Object.values(LEAGUE_MAP).map((l) => l.fdId).join(',');
    }

    const data = await this.get<FDMatchList>('/matches', params);
    return data.matches
      .map((m) => this.mapMatch(m, FD_TO_LEAGUE_ID[m.competition?.code ?? ''] ?? 0))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getTodayFixtures(filters?: FixtureFilters): Promise<Fixture[]> {
    const today = new Date().toISOString().split('T')[0];

    const params: Record<string, unknown> = { dateFrom: today, dateTo: today };

    if (filters?.leagueId && LEAGUE_MAP[filters.leagueId]) {
      params.competitions = LEAGUE_MAP[filters.leagueId].fdId;
    } else {
      params.competitions = Object.values(LEAGUE_MAP).map((l) => l.fdId).join(',');
    }

    const data = await this.get<FDMatchList>('/matches', params);
    return data.matches.map((m) => this.mapMatch(m, FD_TO_LEAGUE_ID[m.competition?.code ?? ''] ?? 0));
  }

  async getFixtureById(fixtureId: number): Promise<Fixture | null> {
    try {
      const data = await this.get<FDMatch>(`/matches/${fixtureId}`);
      const leagueId = FD_TO_LEAGUE_ID[data.competition?.code ?? ''] ?? 0;
      return this.mapMatch(data, leagueId);
    } catch (err) {
      logger.warn('FootballDataOrg: match not found', { fixtureId, err });
      return null;
    }
  }

  async getTeamForm(teamId: number, _season?: number, last = 15): Promise<TeamForm> {
    const data = await this.get<FDMatchList>(`/teams/${teamId}/matches`, { status: 'FINISHED', limit: last });
    const matches = data.matches ?? [];
    return this.buildTeamForm(teamId, matches);
  }

  async getHeadToHead(teamA: number, teamB: number, last = 10): Promise<HeadToHead> {
    // football-data.org H2H está disponível no endpoint de partida
    // Buscamos jogos recentes do time A e filtramos pelo time B
    try {
      const data = await this.get<{ matches: FDMatch[]; resultSet?: { count: number } }>(
        `/teams/${teamA}/matches`, { status: 'FINISHED', limit: 50 }
      );
      const h2hMatches = (data.matches ?? [])
        .filter((m) => m.homeTeam.id === teamB || m.awayTeam.id === teamB)
        .slice(0, last);

      return this.buildH2H(teamA, teamB, h2hMatches);
    } catch {
      return this.buildH2H(teamA, teamB, []);
    }
  }

  async getLineup(_fixtureId: number): Promise<Lineup | null> {
    // Lineups não disponíveis no plano gratuito do football-data.org
    return null;
  }

  async getTransfers(_teamId: number): Promise<Transfer[]> {
    // Transferências não disponíveis no plano gratuito
    return [];
  }

  async getPlayerStats(_playerId: number): Promise<PlayerStats | null> {
    return null;
  }

  async getLeagues(): Promise<League[]> {
    return Object.entries(LEAGUE_MAP).map(([id, l]) => ({
      id: Number(id),
      name: l.name,
      type: 'League',
      logo: l.logo,
      country: { name: l.country },
    }));
  }

  // ---- Mapping ----

  private mapMatch(m: FDMatch, leagueId: number): Fixture {
    const leagueInfo = LEAGUE_MAP[leagueId] ?? { name: m.competition?.name ?? 'Unknown', country: '', logo: '' };
    const matchDate = new Date(m.utcDate);
    const statusMap: Record<string, Fixture['status']['short']> = {
      SCHEDULED: 'NS', TIMED: 'NS', IN_PLAY: '1H', PAUSED: 'HT',
      FINISHED: 'FT', POSTPONED: 'PST', CANCELLED: 'CANC', SUSPENDED: 'SUSP',
    };

    return {
      id: m.id,
      timezone: 'UTC',
      date: m.utcDate,
      timestamp: Math.floor(matchDate.getTime() / 1000),
      referee: m.referees?.[0]?.name,
      status: {
        long: m.status,
        short: statusMap[m.status] ?? 'NS',
        elapsed: m.minute ?? undefined,
      },
      league: {
        id: leagueId,
        name: leagueInfo.name,
        type: 'League',
        logo: leagueInfo.logo,
        country: { name: leagueInfo.country },
        season: { year: m.season?.startDate ? new Date(m.season.startDate).getFullYear() : new Date().getFullYear(), start: m.season?.startDate ?? '', end: m.season?.endDate ?? '', current: true },
      },
      teams: {
        home: {
          id: m.homeTeam.id,
          name: m.homeTeam.name,
          code: m.homeTeam.tla ?? '',
          logo: `https://crests.football-data.org/${m.homeTeam.id}.png`,
          winner: m.score?.winner === 'HOME_TEAM' ? true : m.score?.winner === 'AWAY_TEAM' ? false : undefined,
        },
        away: {
          id: m.awayTeam.id,
          name: m.awayTeam.name,
          code: m.awayTeam.tla ?? '',
          logo: `https://crests.football-data.org/${m.awayTeam.id}.png`,
          winner: m.score?.winner === 'AWAY_TEAM' ? true : m.score?.winner === 'HOME_TEAM' ? false : undefined,
        },
      },
      goals: {
        home: m.score?.fullTime?.home ?? null,
        away: m.score?.fullTime?.away ?? null,
      },
      score: {
        halftime: { home: m.score?.halfTime?.home ?? null, away: m.score?.halfTime?.away ?? null },
        fulltime: { home: m.score?.fullTime?.home ?? null, away: m.score?.fullTime?.away ?? null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    };
  }

  private buildTeamForm(teamId: number, matches: FDMatch[]): TeamForm {
    const recentMatches: RecentMatch[] = matches.map((m) => {
      const leagueId = FD_TO_LEAGUE_ID[m.competition?.code ?? ''] ?? 0;
      const leagueInfo = LEAGUE_MAP[leagueId];
      const isHome = m.homeTeam.id === teamId;
      const myGoals = isHome ? (m.score?.fullTime?.home ?? 0) : (m.score?.fullTime?.away ?? 0);
      const theirGoals = isHome ? (m.score?.fullTime?.away ?? 0) : (m.score?.fullTime?.home ?? 0);
      const result: 'W' | 'D' | 'L' = myGoals > theirGoals ? 'W' : myGoals === theirGoals ? 'D' : 'L';

      return {
        fixtureId: m.id,
        date: m.utcDate,
        homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, logo: `https://crests.football-data.org/${m.homeTeam.id}.png`, code: m.homeTeam.tla ?? '' },
        awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, logo: `https://crests.football-data.org/${m.awayTeam.id}.png`, code: m.awayTeam.tla ?? '' },
        homeGoals: m.score?.fullTime?.home ?? 0,
        awayGoals: m.score?.fullTime?.away ?? 0,
        result, isHome,
        league: { id: leagueId, name: leagueInfo?.name ?? m.competition?.name ?? '', type: 'League', logo: leagueInfo?.logo ?? '', country: { name: leagueInfo?.country ?? '' } },
      };
    });

    const summarize = (ms: RecentMatch[]) => {
      const wins = ms.filter((m) => m.result === 'W').length;
      const draws = ms.filter((m) => m.result === 'D').length;
      const losses = ms.filter((m) => m.result === 'L').length;
      const gf = ms.reduce((s, m) => s + (m.isHome ? m.homeGoals : m.awayGoals), 0);
      const ga = ms.reduce((s, m) => s + (m.isHome ? m.awayGoals : m.homeGoals), 0);
      const total = ms.length || 1;
      return {
        wins, draws, losses, goalsFor: gf, goalsAgainst: ga,
        avgGoalsFor: +(gf / total).toFixed(2), avgGoalsAgainst: +(ga / total).toFixed(2),
        avgCorners: 0, avgFouls: 0, avgShots: 0, avgShotsOnTarget: 0, avgYellowCards: 0, avgRedCards: 0,
        winRate: +((wins / total) * 100).toFixed(1),
        form: ms.slice(-5).map((m) => m.result).join(''),
        currentStreak: ms.length ? ms[ms.length - 1].result : '',
      };
    };

    const teamName = matches[0]?.homeTeam?.id === teamId ? matches[0].homeTeam.name : matches[0]?.awayTeam?.name ?? '';
    const teamLogo = `https://crests.football-data.org/${teamId}.png`;

    return {
      teamId,
      team: { id: teamId, name: teamName, logo: teamLogo, code: '' },
      last5: summarize(recentMatches.slice(-5)),
      last10: summarize(recentMatches.slice(-10)),
      last15: summarize(recentMatches),
      homeRecord: summarize(recentMatches.filter((m) => m.isHome)),
      awayRecord: summarize(recentMatches.filter((m) => !m.isHome)),
      recentMatches,
    };
  }

  private buildH2H(teamAId: number, teamBId: number, matches: FDMatch[]): HeadToHead {
    let aWins = 0, draws = 0, bWins = 0, totalGoals = 0, btts = 0, over15 = 0, over25 = 0;

    const h2hMatches = matches.map((m) => {
      const hg = m.score?.fullTime?.home ?? 0;
      const ag = m.score?.fullTime?.away ?? 0;
      totalGoals += hg + ag;
      if (hg + ag > 1) over15++;
      if (hg + ag > 2) over25++;
      if (hg > 0 && ag > 0) btts++;
      const winner = hg > ag ? (m.homeTeam.id === teamAId ? 'A' : 'B') : ag > hg ? (m.awayTeam.id === teamAId ? 'A' : 'B') : 'D';
      if (winner === 'A') aWins++; else if (winner === 'B') bWins++; else draws++;

      return {
        fixtureId: m.id,
        date: m.utcDate,
        league: { id: 0, name: m.competition?.name ?? '', type: 'League', logo: '', country: { name: '' } },
        homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, logo: `https://crests.football-data.org/${m.homeTeam.id}.png`, code: '' },
        awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, logo: `https://crests.football-data.org/${m.awayTeam.id}.png`, code: '' },
        homeGoals: hg, awayGoals: ag,
      };
    });

    const n = matches.length || 1;
    return {
      teamA: { id: teamAId, name: '', logo: `https://crests.football-data.org/${teamAId}.png`, code: '' },
      teamB: { id: teamBId, name: '', logo: `https://crests.football-data.org/${teamBId}.png`, code: '' },
      totalMatches: matches.length, teamAWins: aWins, draws, teamBWins: bWins,
      avgGoals: +(totalGoals / n).toFixed(2), avgCorners: 0, avgFouls: 0,
      bttsRate: +(btts / n).toFixed(2), over15Rate: +(over15 / n).toFixed(2), over25Rate: +(over25 / n).toFixed(2),
      matches: h2hMatches,
    };
  }
}

// ---- Raw types ----
interface FDTeam { id: number; name: string; tla?: string; crest?: string }
interface FDMatch {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  competition?: { id: number; name: string; code: string };
  season?: { startDate: string; endDate: string };
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  score?: {
    winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
    fullTime?: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null };
  };
  referees?: { id: number; name: string }[];
}
interface FDMatchList { matches: FDMatch[] }
