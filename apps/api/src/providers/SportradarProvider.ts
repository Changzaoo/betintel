// Sportradar adapter — implement when SPORTRADAR_KEY is provided
import { Fixture, TeamForm, HeadToHead, Lineup, Transfer, PlayerStats, League } from '@betintel/shared';
import { SportsDataProvider } from './SportsDataProvider';

export class SportradarProvider implements SportsDataProvider {
  name = 'Sportradar';

  isAvailable(): boolean {
    return Boolean(process.env.SPORTRADAR_KEY);
  }

  async getUpcomingFixtures(): Promise<Fixture[]> { throw new Error('Sportradar: not implemented'); }
  async getTodayFixtures(): Promise<Fixture[]> { throw new Error('Sportradar: not implemented'); }
  async getFixtureById(): Promise<Fixture | null> { throw new Error('Sportradar: not implemented'); }
  async getTeamForm(): Promise<TeamForm> { throw new Error('Sportradar: not implemented'); }
  async getHeadToHead(): Promise<HeadToHead> { throw new Error('Sportradar: not implemented'); }
  async getLineup(): Promise<Lineup | null> { throw new Error('Sportradar: not implemented'); }
  async getTransfers(): Promise<Transfer[]> { throw new Error('Sportradar: not implemented'); }
  async getPlayerStats(): Promise<PlayerStats | null> { throw new Error('Sportradar: not implemented'); }
  async getLeagues(): Promise<League[]> { throw new Error('Sportradar: not implemented'); }
}
