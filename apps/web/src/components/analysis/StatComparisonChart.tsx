import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TeamForm } from '@betintel/shared';

interface StatComparisonChartProps {
  homeForm: TeamForm;
  awayForm: TeamForm;
}

export function StatComparisonChart({ homeForm, awayForm }: StatComparisonChartProps) {
  const hs = homeForm.last10;
  const as_ = awayForm.last10;

  const data = [
    { stat: 'Gols Marcados', home: hs.avgGoalsFor, away: as_.avgGoalsFor },
    { stat: 'Gols Sofridos', home: hs.avgGoalsAgainst, away: as_.avgGoalsAgainst },
    { stat: 'Escanteios', home: hs.avgCorners, away: as_.avgCorners },
    { stat: 'Finalizações', home: hs.avgShots, away: as_.avgShots },
    { stat: 'No gol', home: hs.avgShotsOnTarget, away: as_.avgShotsOnTarget },
    { stat: 'Faltas', home: hs.avgFouls, away: as_.avgFouls },
  ];

  return (
    <div className="card p-5 space-y-4">
      <h3 className="section-title text-sm">Comparativo estatístico (últimos 10 jogos)</h3>

      <div className="flex justify-center gap-6 text-xs text-white/60">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-brand-500" />
          {homeForm.team.name}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          {awayForm.team.name}
        </div>
      </div>

      <div className="space-y-3">
        {data.map((d) => {
          const total = d.home + d.away || 1;
          const homePct = (d.home / total) * 100;
          return (
            <div key={d.stat} className="space-y-1">
              <div className="flex justify-between text-xs text-white/50">
                <span className="text-brand-400 font-mono">{d.home.toFixed(1)}</span>
                <span className="text-white/50">{d.stat}</span>
                <span className="text-blue-400 font-mono">{d.away.toFixed(1)}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden">
                <div className="bg-brand-500 transition-all" style={{ width: `${homePct}%` }} />
                <div className="bg-blue-500 transition-all flex-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
