import { useUpcomingFixtures, useTodayFixtures } from '../hooks/useFixtures';
import { MatchCard } from '../components/matches/MatchCard';
import { FilterBar } from '../components/matches/FilterBar';
import { MatchCardSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useFilterStore } from '../stores/filterStore';

export function MatchesPage() {
  const { filters, view } = useFilterStore();
  const upcoming = useUpcomingFixtures(filters);
  const today = useTodayFixtures(filters);

  const active = view === 'today' ? today : upcoming;
  const fixtures = active.data ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Partidas</h1>
        <p className="text-white/40 text-sm mt-1">Explore e analise partidas de futebol</p>
      </div>

      <FilterBar />

      {active.isLoading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => <MatchCardSkeleton key={i} />)}
        </div>
      )}

      {active.isError && <ErrorState onRetry={() => active.refetch()} />}

      {!active.isLoading && !active.isError && fixtures.length === 0 && (
        <EmptyState icon="calendar" title="Nenhuma partida encontrada" description="Tente outros filtros ou verifique mais tarde." />
      )}

      {!active.isLoading && fixtures.length > 0 && (
        <>
          <p className="text-xs text-white/30">{fixtures.length} partida{fixtures.length !== 1 ? 's' : ''} encontrada{fixtures.length !== 1 ? 's' : ''}</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {fixtures.map((f) => <MatchCard key={f.id} fixture={f} />)}
          </div>
        </>
      )}
    </div>
  );
}
