import { Brain, TrendingUp, Info } from 'lucide-react';
import type { Prediction } from '@betintel/shared';
import { RiskBadge, ConfidenceBadge } from '../ui/RiskBadge';
import { ConfidenceMeter, ProbabilityBar } from '../ui/ConfidenceMeter';
import { cn } from '../../lib/cn';

interface PredictionPanelProps {
  prediction: Prediction;
  homeTeamName: string;
  awayTeamName: string;
}

export function PredictionPanel({ prediction, homeTeamName, awayTeamName }: PredictionPanelProps) {
  const { probabilities: p, trends, confidenceScore, riskLevel, summary, disclaimer } = prediction;

  return (
    <div className="space-y-4">
      {/* Main probabilities */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">
            <Brain className="h-5 w-5 text-brand-400" />
            Probabilidades Estimadas
          </h3>
          <div className="flex gap-2">
            <RiskBadge risk={riskLevel} />
          </div>
        </div>

        {/* Win probabilities */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <ProbCell label={homeTeamName} value={p.homeWin} color="bg-brand-500" />
          <ProbCell label="Empate" value={p.draw} color="bg-yellow-500" />
          <ProbCell label={awayTeamName} value={p.awayWin} color="bg-blue-500" />
        </div>

        {/* Visual bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          <div className="bg-brand-500 transition-all" style={{ width: `${p.homeWin}%` }} />
          <div className="bg-yellow-500 transition-all" style={{ width: `${p.draw}%` }} />
          <div className="bg-blue-500 transition-all" style={{ width: `${p.awayWin}%` }} />
        </div>

        {/* Goals markets */}
        <div className="space-y-2.5">
          <ProbabilityBar label="Over 1.5 gols" value={p.over15Goals} color={p.over15Goals >= 65 ? 'bg-green-500' : 'bg-yellow-500'} />
          <ProbabilityBar label="Over 2.5 gols" value={p.over25Goals} color={p.over25Goals >= 55 ? 'bg-green-500' : 'bg-yellow-500'} />
          <ProbabilityBar label="Ambas marcam" value={p.btts} color={p.btts >= 55 ? 'bg-green-500' : 'bg-gray-500'} />
        </div>

        {/* Trends comparisons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <TrendComparison label="Escanteios" home={homeTeamName} away={awayTeamName} trend={p.moreCorners} />
          <TrendComparison label="Cartões" home={homeTeamName} away={awayTeamName} trend={p.moreCards} />
          <TrendComparison label="Faltas" home={homeTeamName} away={awayTeamName} trend={p.moreFouls} />
          <TrendComparison label="Finalizações" home={homeTeamName} away={awayTeamName} trend={p.moreShotsOnTarget} />
        </div>

        {/* Confidence */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <ConfidenceMeter value={confidenceScore} label="Score de Confiança Geral" />
        </div>
      </div>

      {/* Trend cards */}
      <div className="space-y-3">
        {trends.map((trend, i) => (
          <div key={i} className={cn('card p-4', trend.confidence === 'high' && 'border-green-500/20')}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('h-4 w-4 shrink-0', trend.confidence === 'high' ? 'text-green-400' : trend.confidence === 'medium' ? 'text-yellow-400' : 'text-gray-400')} />
                <span className="font-semibold text-sm">{trend.label}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <ConfidenceBadge confidence={trend.confidence} />
                <RiskBadge risk={trend.risk} />
              </div>
            </div>

            <div className="mb-3">
              <ConfidenceMeter value={trend.probability} size="sm" />
            </div>

            <p className="text-sm text-white/60 mb-2">{trend.reasoning}</p>

            <div className="space-y-1">
              {trend.dataPoints.map((dp, j) => (
                <div key={j} className="flex items-start gap-1.5 text-xs text-white/40">
                  <span className="text-brand-500 mt-0.5">•</span>
                  {dp}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-4 border-brand-500/20">
        <h4 className="text-sm font-semibold text-brand-400 mb-2 flex items-center gap-2">
          <Brain className="h-4 w-4" /> Resumo da Análise
        </h4>
        <p className="text-sm text-white/70 leading-relaxed">{summary}</p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-white/30 bg-white/5 rounded-lg p-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>{disclaimer}</p>
      </div>
    </div>
  );
}

function ProbCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 text-center">
      <div className={cn('text-2xl font-bold tabular-nums', color.replace('bg-', 'text-'))}>{value}%</div>
      <div className="text-xs text-white/50 mt-1 truncate">{label}</div>
      <div className={cn('h-1 rounded-full mt-2', color)} style={{ opacity: value / 100 + 0.3 }} />
    </div>
  );
}

function TrendComparison({ label, home, away, trend }: { label: string; home: string; away: string; trend: string }) {
  return (
    <div className="bg-white/5 rounded-lg px-3 py-2">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="text-xs font-semibold text-white">
        {trend === 'home' ? <span className="text-brand-400">{home}</span> : trend === 'away' ? <span className="text-blue-400">{away}</span> : <span className="text-white/60">Equilibrado</span>}
      </div>
    </div>
  );
}
