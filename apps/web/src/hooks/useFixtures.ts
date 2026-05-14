import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { FixtureFilters } from '@betintel/shared';

export function useUpcomingFixtures(filters?: FixtureFilters) {
  return useQuery({
    queryKey: ['fixtures', 'upcoming', filters],
    queryFn: () => api.fixtures.upcoming(filters as Record<string, unknown>),
    staleTime: 30 * 60 * 1000,
  });
}

export function useTodayFixtures(filters?: FixtureFilters) {
  return useQuery({
    queryKey: ['fixtures', 'today', filters],
    queryFn: () => api.fixtures.today(filters as Record<string, unknown>),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFixture(id: number | undefined) {
  return useQuery({
    queryKey: ['fixture', id],
    queryFn: () => api.fixtures.byId(id!),
    enabled: Boolean(id),
  });
}

export function useMatchAnalysis(id: number | undefined) {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => api.fixtures.analysis(id!),
    enabled: Boolean(id),
    staleTime: 60 * 60 * 1000,
  });
}

export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: api.leagues,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
