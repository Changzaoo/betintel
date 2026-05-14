import { cn } from '../../lib/cn';

interface ConfidenceMeterProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceMeter({ value, label = 'Confiança', size = 'md' }: ConfidenceMeterProps) {
  const color = value >= 70 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = value >= 70 ? 'text-green-400' : value >= 50 ? 'text-yellow-400' : 'text-red-400';

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${value}%` }} />
        </div>
        <span className={cn('text-xs font-mono font-semibold tabular-nums', textColor)}>{value}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/50">{label}</span>
        <span className={cn('text-sm font-mono font-bold tabular-nums', textColor)}>{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

interface ProbabilityBarProps {
  label: string;
  value: number;
  color?: string;
  total?: number;
}

export function ProbabilityBar({ label, value, color = 'bg-brand-500', total = 100 }: ProbabilityBarProps) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-semibold tabular-nums text-white">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
