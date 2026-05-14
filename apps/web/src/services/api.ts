import axios from 'axios';
import type { Fixture, TeamForm, HeadToHead, Lineup, Transfer, PlayerStats, MatchAnalysis, League, ApiResponse } from '@betintel/shared';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
});

async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await client.get<ApiResponse<T>>(url, { params });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error ?? 'Erro desconhecido');
  return res.data.data;
}

export const api = {
  fixtures: {
    upcoming: (params?: Record<string, unknown>) => get<Fixture[]>('/fixtures/upcoming', params),
    today: (params?: Record<string, unknown>) => get<Fixture[]>('/fixtures/today', params),
    byId: (id: number) => get<Fixture>(`/fixtures/${id}`),
    analysis: (id: number) => get<MatchAnalysis>(`/fixtures/${id}/analysis`),
  },
  teams: {
    form: (teamId: number, season?: number) => get<TeamForm>(`/teams/${teamId}/form`, season ? { season } : undefined),
    transfers: (teamId: number) => get<Transfer[]>(`/teams/${teamId}/transfers`),
  },
  players: {
    stats: (playerId: number, season?: number) => get<PlayerStats>(`/players/${playerId}/stats`, season ? { season } : undefined),
  },
  headToHead: (teamA: number, teamB: number) => get<HeadToHead>('/head-to-head', { teamA, teamB }),
  leagues: () => get<League[]>('/leagues'),
  cache: {
    refresh: (prefix?: string) => client.post('/cache/refresh', { prefix }),
    stats: () => client.get('/cache/stats'),
  },
};
