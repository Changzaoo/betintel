import { User } from 'lucide-react';
import type { PlayerStats } from '@betintel/shared';

interface PlayerStatsTableProps {
  players: PlayerStats[];
  teamName: string;
}

export function PlayerStatsTable({ players, teamName }: PlayerStatsTableProps) {
  if (!players.length) return null;

  return (
    <div className="card p-4 space-y-3">
      <h3 className="section-title">
        <User className="h-5 w-5 text-brand-400" />
        Jogadores — {teamName}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-white/40 border-b border-white/10">
              <th className="text-left py-2 pr-3">Jogador</th>
              <th className="text-right py-2 px-2">P</th>
              <th className="text-right py-2 px-2">G</th>
              <th className="text-right py-2 px-2">A</th>
              <th className="text-right py-2 px-2">Fin</th>
              <th className="text-right py-2 px-2">Min</th>
              <th className="text-right py-2 px-2">CA</th>
              <th className="text-right py-2 px-2">CV</th>
              <th className="text-right py-2 px-2">Nota</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.playerId} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    {p.player.photo ? (
                      <img src={p.player.photo} alt={p.player.name} className="h-7 w-7 rounded-full object-cover border border-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-white/30" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white/90">{p.player.name}</div>
                      <div className="text-xs text-white/30">{p.player.position}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right py-2 px-2 tabular-nums text-white/70">{p.games.appearences}</td>
                <td className="text-right py-2 px-2 tabular-nums font-semibold text-green-400">{p.goals.total}</td>
                <td className="text-right py-2 px-2 tabular-nums text-blue-400">{p.goals.assists}</td>
                <td className="text-right py-2 px-2 tabular-nums text-white/60">{p.shots.total}</td>
                <td className="text-right py-2 px-2 tabular-nums text-white/50">{p.games.minutes}</td>
                <td className="text-right py-2 px-2 tabular-nums text-yellow-400">{p.cards.yellow}</td>
                <td className="text-right py-2 px-2 tabular-nums text-red-400">{p.cards.red}</td>
                <td className="text-right py-2 px-2 tabular-nums text-brand-400 font-mono">{p.games.rating ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/30">P=Partidas · G=Gols · A=Assistências · Fin=Finalizações · Min=Minutos · CA=Cartão Amarelo · CV=Cartão Vermelho</p>
    </div>
  );
}
