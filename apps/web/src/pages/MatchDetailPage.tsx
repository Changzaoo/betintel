import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, User2, Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import { useMatchAnalysis } from '../hooks/useFixtures';
import { PredictionPanel } from '../components/analysis/PredictionPanel';
import { TeamFormCard } from '../components/analysis/TeamFormCard';
import { HeadToHeadPanel } from '../components/analysis/HeadToHeadPanel';
import { LineupView } from '../components/analysis/LineupView';
import { PlayerStatsTable } from '../components/analysis/PlayerStatsTable';
import { TransferList } from '../components/analysis/TransferList';
import { StatComparisonChart } from '../components/analysis/StatComparisonChart';
import { AnalysisSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { useState } from 'react';
import { cn } from '../lib/cn';

type Tab = 'prediction' | 'form' | 'h2h' | 'lineup' | 'players' | 'transfers';

const TABS: { key: Tab; label: string }[] = [
  { key: 'prediction', label: 'Análise' },
  { key: 'form', label: 'Forma' },
  { key: 'h2h', label: 'H2H' },
  { key: 'lineup', label: 'Escalações' },
  { key: 'players', label: 'Jogadores' },
  { key: 'transfers', label: 'Transferências' },
];

export function MatchDetailPage() {
  const { fixtureId } = useParams<{ fixtureId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('prediction');

  const { data: analysis, isLoading, isError, refetch } = useMatchAnalysis(fixtureId ? Number(fixtureId) : undefined);

  if (isLoading) return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm flex items-center gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <AnalysisSkeleton />
    </div>
  );

  if (isError || !analysis) return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm flex items-center gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <ErrorState onRetry={refetch} />
    </div>
  );

  const { fixture, homeForm, awayForm, headToHead, lineup, homeTransfers, awayTransfers, homePlayerStats, awayPlayerStats, prediction } = analysis;
  const matchDate = new Date(fixture.date);
  const isLive = ['1H', 'HT', '2H'].includes(fixture.status.short);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm flex items-center gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {/* Match header */}
      <div className="card p-5 border-brand-500/20">
        {/* League */}
        <div className="flex items-center gap-2 mb-4">
          <img src={fixture.league.logo} alt={fixture.league.name} className="h-5 w-5 object-contain" />
          <span className="text-sm text-white/50">{fixture.league.name}</span>
          {fixture.league.season && <span className="text-sm text-white/30">· {fixture.league.season.year}</span>}
          {isLive && <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400 font-semibold"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />AO VIVO</span>}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-4">
          <TeamHeader team={fixture.teams.home} winner={fixture.teams.home.winner} side="home" />

          <div className="text-center shrink-0 px-2">
            {fixture.status.short !== 'NS' ? (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold tabular-nums">{fixture.goals.home ?? 0}</span>
                <span className="text-white/30 text-2xl">:</span>
                <span className="text-4xl font-bold tabular-nums">{fixture.goals.away ?? 0}</span>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-bold text-white/20">VS</div>
                <div className="text-sm text-brand-400 font-mono mt-1">{format(matchDate, 'HH:mm')}</div>
              </div>
            )}
            <div className="text-xs text-white/30 mt-1">{fixture.status.long}</div>
          </div>

          <TeamHeader team={fixture.teams.away} winner={fixture.teams.away.winner} side="away" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{format(matchDate, "EEEE, d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
          {fixture.venue && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{fixture.venue.name}{fixture.venue.city && `, ${fixture.venue.city}`}</span>}
          {fixture.referee && <span className="flex items-center gap-1"><User2 className="h-3.5 w-3.5" />Árb: {fixture.referee}</span>}
        </div>

        {/* Mock notice */}
        {!analysis.homePlayerStats?.length && (
          <div className="mt-3 flex items-start gap-2 text-xs text-yellow-400/70 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Dados de demonstração — configure API_FOOTBALL_KEY para dados reais
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0', tab === t.key ? 'bg-brand-500 text-white' : 'bg-surface-900 text-white/50 hover:text-white hover:bg-surface-850')}>
            {t.label}
          </button>
        ))}
        <button onClick={() => refetch()} className="ml-auto p-2 btn-ghost shrink-0">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Tab content */}
      <div className="animate-slide-up">
        {tab === 'prediction' && (
          <div className="space-y-4">
            <StatComparisonChart homeForm={homeForm} awayForm={awayForm} />
            <PredictionPanel prediction={prediction} homeTeamName={fixture.teams.home.name} awayTeamName={fixture.teams.away.name} />
          </div>
        )}

        {tab === 'form' && (
          <div className="grid lg:grid-cols-2 gap-4">
            <TeamFormCard form={homeForm} side="home" />
            <TeamFormCard form={awayForm} side="away" />
          </div>
        )}

        {tab === 'h2h' && <HeadToHeadPanel h2h={headToHead} />}

        {tab === 'lineup' && (
          lineup
            ? <LineupView lineup={lineup} />
            : <div className="card p-8 text-center text-white/40">Escalação não disponível ainda</div>
        )}

        {tab === 'players' && (
          <div className="space-y-4">
            <PlayerStatsTable players={homePlayerStats ?? []} teamName={fixture.teams.home.name} />
            <PlayerStatsTable players={awayPlayerStats ?? []} teamName={fixture.teams.away.name} />
            {!homePlayerStats?.length && !awayPlayerStats?.length && (
              <div className="card p-8 text-center text-white/40">Estatísticas individuais não disponíveis</div>
            )}
          </div>
        )}

        {tab === 'transfers' && (
          <div className="space-y-4">
            <TransferList transfers={homeTransfers ?? []} teamName={fixture.teams.home.name} />
            <TransferList transfers={awayTransfers ?? []} teamName={fixture.teams.away.name} />
          </div>
        )}
      </div>
    </div>
  );
}

function TeamHeader({ team, winner, side }: { team: { name: string; logo: string }; winner?: boolean; side: 'home' | 'away' }) {
  return (
    <div className={cn('flex flex-col items-center gap-2 flex-1', side === 'away' && 'items-center')}>
      <img src={team.logo} alt={team.name} className="h-16 w-16 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div className={cn('text-center')}>
        <div className={cn('font-bold text-base sm:text-lg', winner ? 'text-white' : 'text-white/80')}>{team.name}</div>
        <div className="text-xs text-white/30">{side === 'home' ? 'Mandante' : 'Visitante'}</div>
      </div>
      {winner && <Trophy className="h-4 w-4 text-yellow-400" />}
    </div>
  );
}
