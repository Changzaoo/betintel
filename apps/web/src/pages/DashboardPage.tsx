import { Brain, TrendingUp, Calendar, Clock, Activity } from 'lucide-react';
import { useUpcomingFixtures, useTodayFixtures } from '../hooks/useFixtures';
import { MatchCard } from '../components/matches/MatchCard';
import { FilterBar } from '../components/matches/FilterBar';
import { MatchCardSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useFilterStore } from '../stores/filterStore';
import { useAuthStore } from '../stores/authStore';
import { SUPPORTED_LEAGUES } from '@betintel/shared';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { filters, view } = useFilterStore();
  const upcoming = useUpcomingFixtures(filters);
  const today = useTodayFixtures(filters);

  const activeQuery = view === 'today' ? today : upcoming;
  const fixtures = activeQuery.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 border-brand-500/20 bg-gradient-to-r from-surface-900 to-surface-850"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              Olá, {user?.displayName?.split(' ')[0] ?? 'Analista'} 👋
            </h1>
            <p className="text-white/50 text-sm mt-1">Análise estatística avançada para apostas inteligentes</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-lg px-3 py-2">
            <Brain className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-semibold text-brand-400">BetIntel AI</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <QuickStat icon={<Calendar className="h-4 w-4" />} label="Jogos hoje" value={today.data?.length ?? '–'} />
          <QuickStat icon={<Clock className="h-4 w-4" />} label="Próximos 7 dias" value={upcoming.data?.length ?? '–'} />
          <QuickStat icon={<TrendingUp className="h-4 w-4" />} label="Ligas analisadas" value={SUPPORTED_LEAGUES.length} />
          <QuickStat icon={<Activity className="h-4 w-4" />} label="Motor de análise" value="v1.0" />
        </div>
      </motion.div>

      {/* Filters */}
      <FilterBar />

      {/* Fixtures grid */}
      <div>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3">
          {view === 'today' ? 'Jogos de hoje' : view === 'tomorrow' ? 'Jogos de amanhã' : 'Próximos jogos'}
          {!activeQuery.isLoading && fixtures.length > 0 && (
            <span className="ml-2 text-brand-400">({fixtures.length})</span>
          )}
        </h2>

        {activeQuery.isLoading && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        )}

        {activeQuery.isError && (
          <ErrorState onRetry={() => activeQuery.refetch()} />
        )}

        {!activeQuery.isLoading && !activeQuery.isError && fixtures.length === 0 && (
          <EmptyState icon="calendar" title="Nenhum jogo encontrado" description="Tente mudar os filtros ou verifique mais tarde." />
        )}

        {!activeQuery.isLoading && fixtures.length > 0 && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {fixtures.map((f) => <MatchCard key={f.id} fixture={f} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
      <div className="text-brand-400">{icon}</div>
      <div>
        <div className="text-xs text-white/40">{label}</div>
        <div className="text-sm font-bold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
