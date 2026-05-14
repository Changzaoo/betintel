import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';
import { SUPPORTED_LEAGUES } from '@betintel/shared';

export function FilterBar() {
  const { filters, setFilters, resetFilters, view, setView } = useFilterStore();

  return (
    <div className="space-y-3">
      {/* View tabs */}
      <div className="flex gap-1 p-1 bg-surface-900 rounded-lg w-fit">
        {(['upcoming', 'today', 'tomorrow'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === v ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white'}`}
          >
            {v === 'upcoming' ? 'Próximos' : v === 'today' ? 'Hoje' : 'Amanhã'}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Buscar time ou partida..."
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ search: e.target.value || undefined })}
            className="input pl-9 w-full text-sm h-9"
          />
        </div>

        {/* League filter */}
        <select
          value={filters.leagueId ?? ''}
          onChange={(e) => setFilters({ leagueId: e.target.value ? Number(e.target.value) : undefined })}
          className="input text-sm h-9 pr-8"
        >
          <option value="">Todas as ligas</option>
          {SUPPORTED_LEAGUES.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        {/* Clear */}
        {(filters.search || filters.leagueId || filters.country) && (
          <button onClick={resetFilters} className="btn-ghost h-9 px-2 text-white/50 hover:text-white flex items-center gap-1 text-sm">
            <X className="h-4 w-4" /> Limpar
          </button>
        )}
      </div>
    </div>
  );
}
