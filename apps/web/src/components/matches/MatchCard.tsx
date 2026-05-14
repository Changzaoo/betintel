import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import type { Fixture } from '@betintel/shared';
import { cn } from '../../lib/cn';

interface MatchCardProps {
  fixture: Fixture;
  compact?: boolean;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  NS: { label: 'Não iniciado', className: 'text-white/50' },
  '1H': { label: '1º Tempo', className: 'text-green-400 animate-pulse' },
  HT: { label: 'Intervalo', className: 'text-yellow-400' },
  '2H': { label: '2º Tempo', className: 'text-green-400 animate-pulse' },
  FT: { label: 'Encerrado', className: 'text-white/40' },
  PST: { label: 'Adiado', className: 'text-red-400' },
  CANC: { label: 'Cancelado', className: 'text-red-400' },
};

export function MatchCard({ fixture, compact = false }: MatchCardProps) {
  const navigate = useNavigate();
  const { status, teams, goals, date, league, venue } = fixture;
  const cfg = statusConfig[status.short] ?? { label: status.long, className: 'text-white/50' };
  const isLive = ['1H', 'HT', '2H', 'ET', 'P'].includes(status.short);
  const isFinished = status.short === 'FT';
  const matchDate = new Date(date);

  return (
    <div
      onClick={() => navigate(`/matches/${fixture.id}`)}
      className={cn(
        'card-hover cursor-pointer p-4 animate-fade-in',
        isLive && 'border-green-500/30'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <img src={league.logo} alt={league.name} className="h-4 w-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-xs text-white/50 truncate">{league.name}</span>
          {league.season && <span className="text-xs text-white/30">{league.season.year}</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isLive && <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
          <span className={cn('text-xs font-medium', cfg.className)}>{cfg.label}</span>
          {status.elapsed && isLive && <span className="text-xs text-green-400 font-mono">{status.elapsed}'</span>}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-4">
        <TeamDisplay name={teams.home.name} logo={teams.home.logo} winner={teams.home.winner} align="left" />

        <div className="text-center shrink-0">
          {(isLive || isFinished) ? (
            <div className="flex items-center gap-1">
              <span className={cn('text-2xl font-bold tabular-nums w-8 text-right', teams.home.winner && 'text-brand-400')}>{goals.home ?? 0}</span>
              <span className="text-white/30 text-lg">:</span>
              <span className={cn('text-2xl font-bold tabular-nums w-8 text-left', teams.away.winner && 'text-brand-400')}>{goals.away ?? 0}</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-white/70">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono font-semibold">{format(matchDate, 'HH:mm')}</span>
              </div>
              <div className="text-xs text-white/40 mt-0.5">{format(matchDate, 'dd MMM', { locale: ptBR })}</div>
            </div>
          )}
        </div>

        <TeamDisplay name={teams.away.name} logo={teams.away.logo} winner={teams.away.winner} align="right" />
      </div>

      {/* Footer */}
      {!compact && (
        <div className="mt-3 flex items-center justify-between">
          {venue && (
            <div className="flex items-center gap-1 text-xs text-white/30">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-36">{venue.name}</span>
            </div>
          )}
          <button className="ml-auto flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Analisar <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function TeamDisplay({ name, logo, winner, align }: { name: string; logo: string; winner?: boolean; align: 'left' | 'right' }) {
  return (
    <div className={cn('flex items-center gap-3 min-w-0 flex-1', align === 'right' && 'flex-row-reverse')}>
      <img src={logo} alt={name} className="h-9 w-9 object-contain shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="18" fill="%23ffffff10"/></svg>'; }} />
      <span className={cn('font-semibold text-sm truncate', winner ? 'text-white' : 'text-white/80', align === 'right' && 'text-right')}>
        {name}
      </span>
    </div>
  );
}
