import { SportsDataProvider } from './SportsDataProvider';
import { ApiFootballProvider } from './ApiFootballProvider';
import { MockProvider } from './MockProvider';
import { logger } from '../utils/logger';

const apiFootball = new ApiFootballProvider();
const mockProvider = new MockProvider();

export function getProvider(): SportsDataProvider {
  if (apiFootball.isAvailable()) {
    return apiFootball;
  }
  logger.warn('API-Football key not configured — using mock data');
  return mockProvider;
}

export { SportsDataProvider, ApiFootballProvider, MockProvider };
