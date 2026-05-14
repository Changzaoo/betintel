import { z } from 'zod';

export const FixtureFiltersSchema = z.object({
  leagueId: z.coerce.number().optional(),
  teamId: z.coerce.number().optional(),
  country: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  season: z.coerce.number().optional(),
});

export const FixtureIdSchema = z.object({
  fixtureId: z.coerce.number().positive(),
});

export const TeamIdSchema = z.object({
  teamId: z.coerce.number().positive(),
});

export const PlayerIdSchema = z.object({
  playerId: z.coerce.number().positive(),
});

export const H2HSchema = z.object({
  teamA: z.coerce.number().positive(),
  teamB: z.coerce.number().positive(),
  season: z.coerce.number().optional(),
});

export const LeagueIdSchema = z.object({
  leagueId: z.coerce.number().positive(),
});

export type FixtureFiltersInput = z.infer<typeof FixtureFiltersSchema>;
export type FixtureIdInput = z.infer<typeof FixtureIdSchema>;
export type TeamIdInput = z.infer<typeof TeamIdSchema>;
export type PlayerIdInput = z.infer<typeof PlayerIdSchema>;
export type H2HInput = z.infer<typeof H2HSchema>;
