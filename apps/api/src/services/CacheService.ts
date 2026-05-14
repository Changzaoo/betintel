import { CACHE_TTL } from '@betintel/shared';
import { logger } from '../utils/logger';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory cache with TTL — replaced by Firestore in production
class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(prefix?: string): void {
    if (!prefix) {
      this.store.clear();
      return;
    }
    for (const k of this.store.keys()) {
      if (k.startsWith(prefix)) this.store.delete(k);
    }
  }

  stats() {
    return { size: this.store.size, keys: [...this.store.keys()] };
  }
}

const cache = new InMemoryCache();

export const CacheService = {
  getUpcomingFixtures: <T>(key: string) => cache.get<T>(`upcoming:${key}`),
  setUpcomingFixtures: <T>(key: string, data: T) => cache.set(`upcoming:${key}`, data, CACHE_TTL.UPCOMING_FIXTURES),

  getTodayFixtures: <T>(key: string) => cache.get<T>(`today:${key}`),
  setTodayFixtures: <T>(key: string, data: T) => cache.set(`today:${key}`, data, CACHE_TTL.TODAY_FIXTURES),

  getFixture: <T>(id: number) => cache.get<T>(`fixture:${id}`),
  setFixture: <T>(id: number, data: T) => cache.set(`fixture:${id}`, data, CACHE_TTL.UPCOMING_FIXTURES),

  getTeamForm: <T>(teamId: number, season: number) => cache.get<T>(`teamform:${teamId}:${season}`),
  setTeamForm: <T>(teamId: number, season: number, data: T) => cache.set(`teamform:${teamId}:${season}`, data, CACHE_TTL.TEAM_FORM),

  getH2H: <T>(a: number, b: number) => cache.get<T>(`h2h:${Math.min(a, b)}:${Math.max(a, b)}`),
  setH2H: <T>(a: number, b: number, data: T) => cache.set(`h2h:${Math.min(a, b)}:${Math.max(a, b)}`, data, CACHE_TTL.HEAD_TO_HEAD),

  getLineup: <T>(fixtureId: number) => cache.get<T>(`lineup:${fixtureId}`),
  setLineup: <T>(fixtureId: number, data: T) => cache.set(`lineup:${fixtureId}`, data, CACHE_TTL.LINEUPS),

  getPrediction: <T>(fixtureId: number) => cache.get<T>(`prediction:${fixtureId}`),
  setPrediction: <T>(fixtureId: number, data: T) => cache.set(`prediction:${fixtureId}`, data, CACHE_TTL.PREDICTIONS),

  getPlayerStats: <T>(playerId: number, season: number) => cache.get<T>(`player:${playerId}:${season}`),
  setPlayerStats: <T>(playerId: number, season: number, data: T) => cache.set(`player:${playerId}:${season}`, data, CACHE_TTL.PLAYER_STATS),

  getTransfers: <T>(teamId: number) => cache.get<T>(`transfers:${teamId}`),
  setTransfers: <T>(teamId: number, data: T) => cache.set(`transfers:${teamId}`, data, CACHE_TTL.TRANSFERS),

  clear: (prefix?: string) => {
    cache.clear(prefix);
    logger.info('Cache cleared', { prefix });
  },

  stats: () => cache.stats(),
};
