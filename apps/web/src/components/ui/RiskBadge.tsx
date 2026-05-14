import { cn } from '../../lib/cn';
import type { RiskLevel, ConfidenceLevel } from '@betintel/shared';

const riskConfig = {
  conservative: { label: 'Conservador', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  moderate: { label: 'Moderado', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  aggressive: { label: 'Agressivo', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

const confidenceConfig = {
  low: { label: 'Confiança Baixa', className: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
  medium: { label: 'Confiança Média', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  high: { label: 'Confiança Alta', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cfg = riskConfig[risk];
  return (
    <span className={cn('badge border', cfg.className)}>
      {cfg.label}
    </span>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  const cfg = confidenceConfig[confidence];
  return (
    <span className={cn('badge border', cfg.className)}>
      {cfg.label}
    </span>
  );
}
