import {
  Fixture, TeamForm, HeadToHead, Lineup,
  Transfer, PlayerStats, League, FixtureFilters
} from '@betintel/shared';

export interface SportsDataProvider {
  name: string;
  isAvailable(): boolean;

  getUpcomingFixtures(filters?: FixtureFilters): Promise<Fixture[]>;
  getTodayFixtures(filters?: FixtureFilters): Promise<Fixture[]>;
  getFixtureById(fixtureId: number): Promise<Fixture | null>;
  getTeamForm(teamId: number, season?: number, last?: number): Promise<TeamForm>;
  getHeadToHead(teamA: number, teamB: number, last?: number): Promise<HeadToHead>;
  getLineup(fixtureId: number): Promise<Lineup | null>;
  getTransfers(teamId: number): Promise<Transfer[]>;
  getPlayerStats(playerId: number, season?: number): Promise<PlayerStats | null>;
  getLeagues(): Promise<League[]>;
}
