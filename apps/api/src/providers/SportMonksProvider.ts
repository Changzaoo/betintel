// SportMonks adapter — implement when SPORTMONKS_KEY is provided
import { Fixture, TeamForm, HeadToHead, Lineup, Transfer, PlayerStats, League } from '@betintel/shared';
import { SportsDataProvider } from './SportsDataProvider';

export class SportMonksProvider implements SportsDataProvider {
  name = 'SportMonks';

  isAvailable(): boolean {
    return Boolean(process.env.SPORTMONKS_KEY);
  }

  async getUpcomingFixtures(): Promise<Fixture[]> { throw new Error('SportMonks: not implemented'); }
  async getTodayFixtures(): Promise<Fixture[]> { throw new Error('SportMonks: not implemented'); }
  async getFixtureById(): Promise<Fixture | null> { throw new Error('SportMonks: not implemented'); }
  async getTeamForm(): Promise<TeamForm> { throw new Error('SportMonks: not implemented'); }
  async getHeadToHead(): Promise<HeadToHead> { throw new Error('SportMonks: not implemented'); }
  async getLineup(): Promise<Lineup | null> { throw new Error('SportMonks: not implemented'); }
  async getTransfers(): Promise<Transfer[]> { throw new Error('SportMonks: not implemented'); }
  async getPlayerStats(): Promise<PlayerStats | null> { throw new Error('SportMonks: not implemented'); }
  async getLeagues(): Promise<League[]> { throw new Error('SportMonks: not implemented'); }
}
