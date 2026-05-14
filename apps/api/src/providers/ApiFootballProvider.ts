import axios, { AxiosInstance } from 'axios';
import {
  Fixture, TeamForm, HeadToHead, Lineup, Transfer,
  PlayerStats, League, FixtureFilters, RecentMatch
} from '@betintel/shared';
import { SportsDataProvider } from './SportsDataProvider';
import { logger } from '../utils/logger';
import { CURRENT_SEASON } from '@betintel/shared';

export class ApiFootballProvider implements SportsDataProvider {
  name = 'API-Football';
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.API_FOOTBALL_KEY ?? '';
    this.client = axios.create({
      baseURL: process.env.API_FOOTBALL_BASE_URL ?? 'https://v3.football.api-sports.io',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
      timeout: 10000,
    });
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  private async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const res = await this.client.get(path, { params });
    return res.data;
  }

  async getUpcomingFixtures(filters?: FixtureFilters): Promise<Fixture[]> {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const params: Record<string, unknown> = {
      from: today.toISOString().split('T')[0],
      to: nextWeek.toISOString().split('T')[0],
      season: CURRENT_SEASON,
    };

    if (filters?.leagueId) params.league = filters.leagueId;
    if (filters?.teamId) params.team = filters.teamId;

    const res = await this.get<{ response: RawFixture[] }>('/fixtures', params);
    return res.response.map(this.mapFixture);
  }

  async getTodayFixtures(filters?: FixtureFilters): Promise<Fixture[]> {
    const today = new Date().toISOString().split('T')[0];
    const params: Record<string, unknown> = { date: today, season: CURRENT_SEASON };
    if (filters?.leagueId) params.league = filters.leagueId;
    const res = await this.get<{ response: RawFixture[] }>('/fixtures', params);
    return res.response.map(this.mapFixture);
  }

  async getFixtureById(fixtureId: number): Promise<Fixture | null> {
    const res = await this.get<{ response: RawFixture[] }>('/fixtures', { id: fixtureId });
    if (!res.response.length) return null;
    return this.mapFixture(res.response[0]);
  }

  async getTeamForm(teamId: number, season = CURRENT_SEASON, last = 15): Promise<TeamForm> {
    const res = await this.get<{ response: RawFixture[] }>('/fixtures', {
      team: teamId, season, last,
    });

    const fixtures = res.response.map(this.mapFixture);
    return this.buildTeamForm(teamId, fixtures);
  }

  async getHeadToHead(teamA: number, teamB: number, last = 10): Promise<HeadToHead> {
    const res = await this.get<{ response: RawFixture[] }>('/fixtures/headtohead', {
      h2h: `${teamA}-${teamB}`, last,
    });

    const fixtures = res.response.map(this.mapFixture);
    return this.buildH2H(teamA, teamB, fixtures);
  }

  async getLineup(fixtureId: number): Promise<Lineup | null> {
    try {
      const res = await this.get<{ response: RawLineup[] }>('/fixtures/lineups', { fixture: fixtureId });
      if (!res.response.length) return null;
      return this.mapLineup(fixtureId, res.response);
    } catch (err) {
      logger.warn('Failed to get lineup', err);
      return null;
    }
  }

  async getTransfers(teamId: number): Promise<Transfer[]> {
    const res = await this.get<{ response: RawTransfer[] }>('/transfers', { team: teamId });
    return res.response.flatMap((t) =>
      t.transfers.slice(0, 10).map((tr) => ({
        player: { id: t.player.id, name: t.player.name },
        type: (tr.type?.toLowerCase().includes('loan') ? 'loan_in' : 'buy') as Transfer['type'],
        date: tr.date,
        fromTeam: tr.teams.out ? { id: tr.teams.out.id, name: tr.teams.out.name, logo: tr.teams.out.logo, code: '' } : undefined,
        toTeam: tr.teams.in ? { id: tr.teams.in.id, name: tr.teams.in.name, logo: tr.teams.in.logo, code: '' } : undefined,
        fee: tr.type,
      }))
    );
  }

  async getPlayerStats(playerId: number, season = CURRENT_SEASON): Promise<PlayerStats | null> {
    const res = await this.get<{ response: RawPlayerStats[] }>('/players', { id: playerId, season });
    if (!res.response.length) return null;
    const raw = res.response[0];
    const stats = raw.statistics[0];
    return {
      playerId, season,
      player: { id: raw.player.id, name: raw.player.name, photo: raw.player.photo, nationality: raw.player.nationality, age: raw.player.age, height: raw.player.height, weight: raw.player.weight, position: stats?.games?.position },
      team: { id: stats?.team?.id, name: stats?.team?.name, logo: stats?.team?.logo, code: '' },
      league: { id: stats?.league?.id, name: stats?.league?.name, logo: stats?.league?.logo, type: stats?.league?.type ?? 'League', country: { name: stats?.league?.country ?? '' } },
      games: { appearences: stats?.games?.appearences ?? 0, lineups: stats?.games?.lineups ?? 0, minutes: stats?.games?.minutes ?? 0, position: stats?.games?.position, rating: stats?.games?.rating },
      substitutes: { in: stats?.substitutes?.in ?? 0, out: stats?.substitutes?.out ?? 0, bench: stats?.substitutes?.bench ?? 0 },
      shots: { total: stats?.shots?.total ?? 0, on: stats?.shots?.on ?? 0 },
      goals: { total: stats?.goals?.total ?? 0, conceded: stats?.goals?.conceded ?? 0, assists: stats?.goals?.assists ?? 0 },
      passes: { total: stats?.passes?.total ?? 0, key: stats?.passes?.key ?? 0, accuracy: stats?.passes?.accuracy ?? 0 },
      tackles: { total: stats?.tackles?.total ?? 0, blocks: stats?.tackles?.blocks ?? 0, interceptions: stats?.tackles?.interceptions ?? 0 },
      duels: { total: stats?.duels?.total ?? 0, won: stats?.duels?.won ?? 0 },
      dribbles: { attempts: stats?.dribbles?.attempts ?? 0, success: stats?.dribbles?.success ?? 0 },
      fouls: { drawn: stats?.fouls?.drawn ?? 0, committed: stats?.fouls?.committed ?? 0 },
      cards: { yellow: stats?.cards?.yellow ?? 0, yellowred: stats?.cards?.yellowred ?? 0, red: stats?.cards?.red ?? 0 },
      penalty: { scored: stats?.penalty?.scored ?? 0, missed: stats?.penalty?.missed ?? 0 },
    };
  }

  async getLeagues(): Promise<League[]> {
    const res = await this.get<{ response: { league: { id: number; name: string; type: string; logo: string }; country: { name: string; code: string; flag: string }; seasons: { year: number; start: string; end: string; current: boolean }[] }[] }>('/leagues');
    return res.response.map((r) => ({
      id: r.league.id, name: r.league.name, type: r.league.type, logo: r.league.logo,
      country: r.country,
      season: r.seasons.find((s) => s.current),
    }));
  }

  // ---- Mapping helpers ----

  private mapFixture = (raw: RawFixture): Fixture => ({
    id: raw.fixture.id,
    referee: raw.fixture.referee,
    timezone: raw.fixture.timezone,
    date: raw.fixture.date,
    timestamp: raw.fixture.timestamp,
    venue: raw.fixture.venue,
    status: { long: raw.fixture.status.long, short: raw.fixture.status.short as Fixture['status']['short'], elapsed: raw.fixture.status.elapsed },
    league: { id: raw.league.id, name: raw.league.name, type: raw.league.type ?? 'League', logo: raw.league.logo, country: { name: raw.league.country, flag: raw.league.flag }, season: { year: raw.league.season, start: '', end: '', current: true } },
    teams: { home: { id: raw.teams.home.id, name: raw.teams.home.name, logo: raw.teams.home.logo, code: '', winner: raw.teams.home.winner }, away: { id: raw.teams.away.id, name: raw.teams.away.name, logo: raw.teams.away.logo, code: '', winner: raw.teams.away.winner } },
    goals: { home: raw.goals.home, away: raw.goals.away },
    score: raw.score,
  });

  private buildTeamForm(teamId: number, fixtures: Fixture[]): TeamForm {
    const recentMatches: RecentMatch[] = fixtures.map((f) => {
      const isHome = f.teams.home.id === teamId;
      const myGoals = isHome ? (f.goals.home ?? 0) : (f.goals.away ?? 0);
      const theirGoals = isHome ? (f.goals.away ?? 0) : (f.goals.home ?? 0);
      const result: 'W' | 'D' | 'L' = myGoals > theirGoals ? 'W' : myGoals === theirGoals ? 'D' : 'L';
      const team = isHome ? f.teams.home : f.teams.away;
      return { fixtureId: f.id, date: f.date, homeTeam: f.teams.home, awayTeam: f.teams.away, homeGoals: f.goals.home ?? 0, awayGoals: f.goals.away ?? 0, result, isHome, league: f.league };
      void team;
    });

    const summarize = (matches: RecentMatch[]) => {
      const wins = matches.filter((m) => m.result === 'W').length;
      const draws = matches.filter((m) => m.result === 'D').length;
      const losses = matches.filter((m) => m.result === 'L').length;
      const gf = matches.reduce((s, m) => s + (m.isHome ? m.homeGoals : m.awayGoals), 0);
      const ga = matches.reduce((s, m) => s + (m.isHome ? m.awayGoals : m.homeGoals), 0);
      const total = matches.length || 1;
      return {
        wins, draws, losses, goalsFor: gf, goalsAgainst: ga,
        avgGoalsFor: +(gf / total).toFixed(2), avgGoalsAgainst: +(ga / total).toFixed(2),
        avgCorners: 5, avgFouls: 12, avgShots: 13, avgShotsOnTarget: 5,
        avgYellowCards: 2, avgRedCards: 0,
        winRate: +((wins / total) * 100).toFixed(1),
        form: matches.slice(-5).map((m) => m.result).join(''),
        currentStreak: matches.length ? `${matches[matches.length - 1].result}` : '',
      };
    };

    const team = fixtures[0]?.teams.home.id === teamId ? fixtures[0].teams.home : fixtures[0]?.teams.away;

    return {
      teamId, team: team ?? { id: teamId, name: '', logo: '', code: '' },
      last5: summarize(recentMatches.slice(-5)),
      last10: summarize(recentMatches.slice(-10)),
      last15: summarize(recentMatches),
      homeRecord: summarize(recentMatches.filter((m) => m.isHome)),
      awayRecord: summarize(recentMatches.filter((m) => !m.isHome)),
      recentMatches,
    };
  }

  private buildH2H(teamAId: number, teamBId: number, fixtures: Fixture[]): HeadToHead {
    const teamA = fixtures[0]?.teams.home.id === teamAId ? fixtures[0].teams.home : fixtures[0]?.teams.away ?? { id: teamAId, name: '', logo: '', code: '' };
    const teamB = fixtures[0]?.teams.away.id === teamBId ? fixtures[0].teams.away : fixtures[0]?.teams.home ?? { id: teamBId, name: '', logo: '', code: '' };

    let aWins = 0, draws = 0, bWins = 0, totalGoals = 0, btts = 0, over15 = 0, over25 = 0;
    fixtures.forEach((f) => {
      const hg = f.goals.home ?? 0, ag = f.goals.away ?? 0;
      const total = hg + ag;
      totalGoals += total;
      if (total > 1) over15++;
      if (total > 2) over25++;
      if (hg > 0 && ag > 0) btts++;
      const homeIsA = f.teams.home.id === teamAId;
      const winner = hg > ag ? f.teams.home : ag > hg ? f.teams.away : null;
      if (!winner) draws++;
      else if (winner.id === teamAId) aWins++;
      else bWins++;
      void homeIsA;
    });

    const n = fixtures.length || 1;
    return {
      teamA, teamB,
      totalMatches: fixtures.length, teamAWins: aWins, draws, teamBWins: bWins,
      avgGoals: +(totalGoals / n).toFixed(2), avgCorners: 9, avgFouls: 24,
      bttsRate: +(btts / n).toFixed(2), over15Rate: +(over15 / n).toFixed(2), over25Rate: +(over25 / n).toFixed(2),
      matches: fixtures.slice(0, 10).map((f) => ({
        fixtureId: f.id, date: f.date, league: f.league,
        homeTeam: f.teams.home, awayTeam: f.teams.away,
        homeGoals: f.goals.home ?? 0, awayGoals: f.goals.away ?? 0,
      })),
    };
  }

  private mapLineup(fixtureId: number, raw: RawLineup[]): Lineup {
    const mapSide = (side: RawLineup) => ({
      team: { id: side.team.id, name: side.team.name, logo: side.team.logo, code: '' },
      formation: side.formation,
      coach: { id: side.coach.id, name: side.coach.name, photo: side.coach.photo },
      startXI: side.startXI.map((p) => ({ player: { id: p.player.id, name: p.player.name, number: p.player.number, position: p.player.pos }, position: p.player.pos ?? '', grid: p.player.grid, number: p.player.number })),
      substitutes: side.substitutes.map((p) => ({ player: { id: p.player.id, name: p.player.name, number: p.player.number, position: p.player.pos }, position: p.player.pos ?? '' })),
      injured: [], suspended: [], doubtful: [],
    });

    return {
      fixtureId, isOfficial: true, lastUpdated: new Date().toISOString(),
      home: mapSide(raw[0]),
      away: mapSide(raw[1] ?? raw[0]),
    };
  }
}

// ---- Raw API types ----
interface RawFixture {
  fixture: { id: number; referee?: string; timezone: string; date: string; timestamp: number; venue?: { name: string; city?: string; capacity?: number }; status: { long: string; short: string; elapsed?: number } };
  league: { id: number; name: string; country: string; logo: string; flag?: string; season: number; round?: string; type?: string };
  teams: { home: { id: number; name: string; logo: string; winner?: boolean }; away: { id: number; name: string; logo: string; winner?: boolean } };
  goals: { home: number | null; away: number | null };
  score?: Fixture['score'];
}

interface RawLineup {
  team: { id: number; name: string; logo: string };
  formation: string;
  coach: { id: number; name: string; photo: string };
  startXI: { player: { id: number; name: string; number: number; pos?: string; grid?: string } }[];
  substitutes: { player: { id: number; name: string; number: number; pos?: string } }[];
}

interface RawTransfer {
  player: { id: number; name: string };
  transfers: { date: string; type: string; teams: { in?: { id: number; name: string; logo: string }; out?: { id: number; name: string; logo: string } } }[];
}

interface RawPlayerStats {
  player: { id: number; name: string; photo: string; nationality: string; age: number; height: string; weight: string };
  statistics: { team: { id: number; name: string; logo: string }; league: { id: number; name: string; logo: string; country: string; type?: string }; games: { appearences: number; lineups: number; minutes: number; position?: string; rating?: string }; substitutes: { in: number; out: number; bench: number }; shots: { total: number; on: number }; goals: { total: number; conceded: number; assists: number }; passes: { total: number; key: number; accuracy: number }; tackles: { total: number; blocks: number; interceptions: number }; duels: { total: number; won: number }; dribbles: { attempts: number; success: number }; fouls: { drawn: number; committed: number }; cards: { yellow: number; yellowred: number; red: number }; penalty: { scored: number; missed: number } }[];
}
