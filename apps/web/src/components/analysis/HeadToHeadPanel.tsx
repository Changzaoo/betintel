import { ArrowLeftRight, Trophy } from 'lucide-react';
import type { HeadToHead } from '@betintel/shared';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeadToHeadPanelProps {
  h2h: HeadToHead;
}

export function HeadToHeadPanel({ h2h }: HeadToHeadPanelProps) {
  const { teamA, teamB, totalMatches, teamAWins, draws, teamBWins, matches } = h2h;
  const total = totalMatches || 1;

  return (
    <div className="card p-5 space-y-5">
      <h3 className="section-title">
        <ArrowLeftRight className="h-5 w-5 text-brand-400" />
        Confrontos Diretos
      </h3>

      {/* Win distribution */}
      <div className="flex items-center gap-3">
        <div className="text-center shrink-0 w-20">
          <img src={teamA.logo} alt={teamA.name} className="h-10 w-10 mx-auto object-contain mb-1" />
          <div className="text-2xl font-bold text-brand-400">{teamAWins}</div>
          <div className="text-xs text-white/40 truncate">{teamA.name}</div>
        </div>

        <div className="flex-1 space-y-1">
          {/* Bar */}
          <div className="flex h-4 rounded-full overflow-hidden">
            <div className="bg-brand-500 transition-all" style={{ width: `${(teamAWins / total) * 100}%` }} />
            <div className="bg-white/20 transition-all" style={{ width: `${(draws / total) * 100}%` }} />
            <div className="bg-blue-500 transition-all" style={{ width: `${(teamBWins / total) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/40">
            <span>{Math.round((teamAWins / total) * 100)}%</span>
            <span>{draws} empates</span>
            <span>{Math.round((teamBWins / total) * 100)}%</span>
          </div>
        </div>

        <div className="text-center shrink-0 w-20">
          <img src={teamB.logo} alt={teamB.name} className="h-10 w-10 mx-auto object-contain mb-1" />
          <div className="text-2xl font-bold text-blue-400">{teamBWins}</div>
          <div className="text-xs text-white/40 truncate">{teamB.name}</div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <StatCard label="Média de gols" value={h2h.avgGoals.toFixed(1)} />
        <StatCard label="BTTS" value={`${Math.round(h2h.bttsRate * 100)}%`} />
        <StatCard label="Over 2.5" value={`${Math.round(h2h.over25Rate * 100)}%`} />
      </div>

      {/* Recent matches */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white/70">Últimos confrontos</h4>
        {matches.slice(0, 6).map((m) => {
          const isDraw = m.homeGoals === m.awayGoals;
          const homeWon = m.homeGoals > m.awayGoals;
          return (
            <div key={m.fixtureId} className="bg-white/5 rounded-lg px-3 py-2.5 flex items-center gap-3">
              <span className="text-xs text-white/30 w-20 shrink-0">{format(new Date(m.date), 'dd/MM/yyyy', { locale: ptBR })}</span>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`text-xs font-medium truncate text-right flex-1 ${homeWon ? 'text-white' : 'text-white/50'}`}>{m.homeTeam.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-sm font-bold tabular-nums w-4 text-right ${homeWon ? 'text-brand-400' : ''}`}>{m.homeGoals}</span>
                  <span className="text-white/30">-</span>
                  <span className={`text-sm font-bold tabular-nums w-4 ${!homeWon && !isDraw ? 'text-blue-400' : ''}`}>{m.awayGoals}</span>
                </div>
                <span className={`text-xs font-medium truncate flex-1 ${!homeWon && !isDraw ? 'text-white' : 'text-white/50'}`}>{m.awayTeam.name}</span>
              </div>

              {m.winner && (
                <Trophy className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </div>
  );
}
