import { Fixture, TeamForm, HeadToHead, Lineup, Transfer, PlayerStats, League, FixtureFilters } from '@betintel/shared';
import { SportsDataProvider } from './SportsDataProvider';
import { MOCK_FIXTURES, getMockTeamForm, getMockHeadToHead, getMockLineup, getMockTransfers, getMockPlayerStats } from '../services/MockData';
import { SUPPORTED_LEAGUES } from '@betintel/shared';

export class MockProvider implements SportsDataProvider {
  name = 'Mock (Dados de Demonstração)';

  isAvailable(): boolean {
    return true;
  }

  async getUpcomingFixtures(filters?: FixtureFilters): Promise<Fixture[]> {
    let fixtures = MOCK_FIXTURES.filter((f) => {
      const now = Date.now();
      return new Date(f.date).getTime() > now;
    });
    if (filters?.leagueId) fixtures = fixtures.filter((f) => f.league.id === filters.leagueId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      fixtures = fixtures.filter((f) => f.teams.home.name.toLowerCase().includes(q) || f.teams.away.name.toLowerCase().includes(q));
    }
    return fixtures;
  }

  async getTodayFixtures(filters?: FixtureFilters): Promise<Fixture[]> {
    const today = new Date().toDateString();
    let fixtures = MOCK_FIXTURES.filter((f) => new Date(f.date).toDateString() === today);
    if (!fixtures.length) fixtures = MOCK_FIXTURES.slice(0, 3);
    if (filters?.leagueId) fixtures = fixtures.filter((f) => f.league.id === filters.leagueId);
    return fixtures;
  }

  async getFixtureById(fixtureId: number): Promise<Fixture | null> {
    return MOCK_FIXTURES.find((f) => f.id === fixtureId) ?? MOCK_FIXTURES[0];
  }

  async getTeamForm(teamId: number): Promise<TeamForm> {
    return getMockTeamForm(teamId);
  }

  async getHeadToHead(teamA: number, teamB: number): Promise<HeadToHead> {
    return getMockHeadToHead(teamA, teamB);
  }

  async getLineup(fixtureId: number): Promise<Lineup | null> {
    return getMockLineup(fixtureId);
  }

  async getTransfers(teamId: number): Promise<Transfer[]> {
    return getMockTransfers(teamId);
  }

  async getPlayerStats(playerId: number): Promise<PlayerStats | null> {
    return getMockPlayerStats(playerId);
  }

  async getLeagues(): Promise<League[]> {
    return SUPPORTED_LEAGUES.map((l) => ({
      id: l.id, name: l.name, type: 'League', logo: l.logo,
      country: { name: l.country },
    }));
  }
}
