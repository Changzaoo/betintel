import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TeamForm } from '@betintel/shared';
import { cn } from '../../lib/cn';

interface TeamFormCardProps {
  form: TeamForm;
  side: 'home' | 'away';
}

export function TeamFormCard({ form, side }: TeamFormCardProps) {
  const isHome = side === 'home';
  const stats = form.last10;

  return (
    <div className="card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img src={form.team.logo} alt={form.team.name} className="h-10 w-10 object-contain" />
        <div>
          <h3 className="font-bold text-white">{form.team.name}</h3>
          <p className="text-xs text-white/40">{isHome ? 'Mandante' : 'Visitante'} · Últimos 10 jogos</p>
        </div>
      </div>

      {/* Form string */}
      <div>
        <p className="text-xs text-white/40 mb-1.5">Forma recente (últ. 5)</p>
        <div className="flex gap-1">
          {Array.from(form.last5.form).map((r, i) => (
            <FormBadge key={i} result={r as 'W' | 'D' | 'L'} />
          ))}
        </div>
      </div>

      {/* W/D/L */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <StatBox value={stats.wins} label="V" color="text-green-400" />
        <StatBox value={stats.draws} label="E" color="text-yellow-400" />
        <StatBox value={stats.losses} label="D" color="text-red-400" />
      </div>

      {/* Win rate */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-white/50">Aproveitamento</span>
          <span className="font-semibold text-white">{stats.winRate}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${stats.winRate}%` }} />
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <StatRow icon={<TrendingUp className="h-3.5 w-3.5 text-green-400" />} label="Gols marcados/jogo" value={stats.avgGoalsFor} />
        <StatRow icon={<TrendingDown className="h-3.5 w-3.5 text-red-400" />} label="Gols sofridos/jogo" value={stats.avgGoalsAgainst} />
        <StatRow icon={<Minus className="h-3.5 w-3.5 text-blue-400" />} label="Escanteios/jogo" value={stats.avgCorners} />
        <StatRow icon={<Minus className="h-3.5 w-3.5 text-yellow-400" />} label="Faltas/jogo" value={stats.avgFouls} />
        <StatRow icon={<Minus className="h-3.5 w-3.5 text-white/40" />} label="Finalizações/jogo" value={stats.avgShots} />
        <StatRow icon={<Minus className="h-3.5 w-3.5 text-white/40" />} label="No gol/jogo" value={stats.avgShotsOnTarget} />
      </div>

      {/* Home/Away record */}
      <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-white/40 mb-1">Em casa</p>
          <p className="text-xs font-semibold">{form.homeRecord.wins}V {form.homeRecord.draws}E {form.homeRecord.losses}D</p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">Fora</p>
          <p className="text-xs font-semibold">{form.awayRecord.wins}V {form.awayRecord.draws}E {form.awayRecord.losses}D</p>
        </div>
      </div>

      {/* Recent matches */}
      {form.recentMatches.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-white/40">Últimas partidas</p>
          {form.recentMatches.slice(0, 5).map((m) => (
            <div key={m.fixtureId} className="flex items-center justify-between text-xs">
              <span className="text-white/60 truncate max-w-24">{m.isHome ? m.awayTeam.name : m.homeTeam.name}</span>
              <span className="text-white/40 font-mono">{m.homeGoals}-{m.awayGoals}</span>
              <FormBadge result={m.result} small />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormBadge({ result, small }: { result: 'W' | 'D' | 'L'; small?: boolean }) {
  const cfg = {
    W: 'bg-green-500/20 text-green-400 border-green-500/30',
    D: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    L: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={cn('border rounded font-bold', small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs', cfg[result])}>
      {result === 'W' ? 'V' : result === 'D' ? 'E' : 'D'}
    </span>
  );
}

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-2 text-center">
      <div className={cn('text-xl font-bold tabular-nums', color)}>{value}</div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1.5">
      {icon}
      <div className="min-w-0">
        <div className="text-[10px] text-white/40 truncate">{label}</div>
        <div className="text-sm font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
