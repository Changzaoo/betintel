import { create } from 'zustand';
import type { FixtureFilters } from '@betintel/shared';

interface FilterState {
  filters: FixtureFilters;
  view: 'upcoming' | 'today' | 'tomorrow';
  setFilters: (f: Partial<FixtureFilters>) => void;
  resetFilters: () => void;
  setView: (v: FilterState['view']) => void;
}

const defaultFilters: FixtureFilters = {};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  view: 'upcoming',
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setView: (view) => set({ view }),
}));
