import { Users, AlertTriangle, MinusCircle, HelpCircle } from 'lucide-react';
import type { Lineup, TeamLineup } from '@betintel/shared';
import { cn } from '../../lib/cn';

interface LineupViewProps {
  lineup: Lineup;
}

export function LineupView({ lineup }: LineupViewProps) {
  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="section-title">
          <Users className="h-5 w-5 text-brand-400" /> Escalações
        </h3>
        {!lineup.isOfficial && (
          <span className="badge bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
            Provável (não oficial)
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <TeamLineupView lineup={lineup.home} side="home" />
        <TeamLineupView lineup={lineup.away} side="away" />
      </div>
    </div>
  );
}

function TeamLineupView({ lineup, side }: { lineup: TeamLineup; side: 'home' | 'away' }) {
  const isHome = side === 'home';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img src={lineup.team.logo} alt={lineup.team.name} className="h-8 w-8 object-contain" />
        <div>
          <div className="font-semibold">{lineup.team.name}</div>
          <div className="text-xs text-white/40">{lineup.formation} · {lineup.coach.name}</div>
        </div>
      </div>

      {/* Pitch visualization */}
      <div className={cn('relative bg-green-900/20 border border-green-800/30 rounded-lg overflow-hidden', 'aspect-[3/4]')}>
        {/* Pitch markings */}
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 h-px bg-green-700/30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border border-green-700/30" />
          <div className="absolute inset-x-8 top-2 h-12 border border-green-700/30 rounded-sm" />
          <div className="absolute inset-x-8 bottom-2 h-12 border border-green-700/30 rounded-sm" />
        </div>

        {/* Players on pitch */}
        {lineup.startXI.map((p) => {
          if (!p.grid) return null;
          const [row, col] = p.grid.split(':').map(Number);
          const rowsInFormation = lineup.formation.split('-').length + 1;
          const colsInRow = parseInt(lineup.formation.split('-')[row - 2] ?? '1') || 1;

          const yPct = isHome
            ? ((row - 1) / rowsInFormation) * 90 + 5
            : 95 - ((row - 1) / rowsInFormation) * 90;
          const xPct = colsInRow === 1 ? 50 : ((col - 1) / (colsInRow - 1)) * 70 + 15;

          return (
            <div
              key={p.player.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
            >
              <div className="h-8 w-8 rounded-full bg-brand-500/80 border-2 border-brand-300 flex items-center justify-center text-xs font-bold text-white mx-auto">
                {p.number ?? p.player.number ?? '?'}
              </div>
              <div className="text-[9px] text-white/80 mt-0.5 max-w-[60px] truncate leading-tight">
                {p.player.name.split(' ').slice(-1)[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Starters list */}
      <div className="space-y-1">
        <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Titulares</p>
        {lineup.startXI.map((p) => (
          <div key={p.player.id} className="flex items-center gap-2 text-sm">
            <span className="w-5 text-right text-xs text-white/30 tabular-nums">{p.number ?? p.player.number}</span>
            <span className="flex-1 text-white/80">{p.player.name}</span>
            <span className="text-xs text-white/30">{p.position}</span>
          </div>
        ))}
      </div>

      {/* Substitutes */}
      {lineup.substitutes.length > 0 && (
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Reservas</p>
          <div className="space-y-1">
            {lineup.substitutes.map((p) => (
              <div key={p.player.id} className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-5 text-right text-xs tabular-nums">{p.number ?? p.player.number}</span>
                <span className="flex-1">{p.player.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Absences */}
      {(lineup.injured.length > 0 || lineup.suspended.length > 0 || lineup.doubtful.length > 0) && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          {lineup.injured.length > 0 && (
            <div>
              <p className="text-xs text-red-400 flex items-center gap-1 mb-1"><AlertTriangle className="h-3 w-3" /> Lesionados</p>
              {lineup.injured.map((p) => <p key={p.player.id} className="text-xs text-white/50 ml-4">{p.player.name}</p>)}
            </div>
          )}
          {lineup.suspended.length > 0 && (
            <div>
              <p className="text-xs text-yellow-400 flex items-center gap-1 mb-1"><MinusCircle className="h-3 w-3" /> Suspensos</p>
              {lineup.suspended.map((p) => <p key={p.player.id} className="text-xs text-white/50 ml-4">{p.player.name}</p>)}
            </div>
          )}
          {lineup.doubtful.length > 0 && (
            <div>
              <p className="text-xs text-orange-400 flex items-center gap-1 mb-1"><HelpCircle className="h-3 w-3" /> Dúvidas</p>
              {lineup.doubtful.map((p) => <p key={p.player.id} className="text-xs text-white/50 ml-4">{p.player.name}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
