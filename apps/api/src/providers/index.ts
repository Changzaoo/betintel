import { SportsDataProvider } from './SportsDataProvider';
import { ApiFootballProvider } from './ApiFootballProvider';
import { FootballDataOrgProvider } from './FootballDataOrgProvider';
import { MockProvider } from './MockProvider';
import { logger } from '../utils/logger';

const apiFootball = new ApiFootballProvider();
const footballDataOrg = new FootballDataOrgProvider();
const mockProvider = new MockProvider();

export function getProvider(): SportsDataProvider {
  if (apiFootball.isAvailable()) {
    logger.info('Provider: API-Football');
    return apiFootball;
  }
  if (footballDataOrg.isAvailable()) {
    logger.info('Provider: football-data.org');
    return footballDataOrg;
  }
  logger.warn('Nenhuma API key configurada — usando mock data. Configure API_FOOTBALL_KEY ou FOOTBALL_DATA_ORG_KEY no .env');
  return mockProvider;
}

export { SportsDataProvider, ApiFootballProvider, FootballDataOrgProvider, MockProvider };
