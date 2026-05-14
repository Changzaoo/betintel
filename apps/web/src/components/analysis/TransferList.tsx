import { ArrowRight, ArrowLeft, ArrowLeftRight } from 'lucide-react';
import type { Transfer } from '@betintel/shared';
import { cn } from '../../lib/cn';

interface TransferListProps {
  transfers: Transfer[];
  teamName: string;
}

const typeConfig = {
  buy: { label: 'Contratação', icon: ArrowRight, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  sell: { label: 'Venda', icon: ArrowLeft, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  loan_in: { label: 'Empréstimo (entrada)', icon: ArrowRight, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  loan_out: { label: 'Empréstimo (saída)', icon: ArrowLeft, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  free: { label: 'Livre', icon: ArrowLeftRight, color: 'text-white/50 bg-white/5 border-white/10' },
};

const impactConfig = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-white/40',
};

export function TransferList({ transfers, teamName }: TransferListProps) {
  if (!transfers.length) return null;

  return (
    <div className="card p-4 space-y-3">
      <h3 className="section-title">
        <ArrowLeftRight className="h-5 w-5 text-brand-400" />
        Transferências — {teamName}
      </h3>
      <div className="space-y-2">
        {transfers.map((t, i) => {
          const cfg = typeConfig[t.type] ?? typeConfig.free;
          const Icon = cfg.icon;
          return (
            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <div className={cn('flex items-center justify-center h-8 w-8 rounded-lg border shrink-0', cfg.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-white/90 truncate">{t.player.name}</span>
                  {t.impact && <span className={cn('text-xs', impactConfig[t.impact])}>● {t.impact === 'high' ? 'Alto impacto' : t.impact === 'medium' ? 'Impacto médio' : 'Baixo impacto'}</span>}
                </div>
                <div className="text-xs text-white/40 mt-0.5">
                  {t.fromTeam && t.toTeam ? (
                    <span>{t.fromTeam.name} → {t.toTeam.name}</span>
                  ) : (
                    <span>{cfg.label}</span>
                  )}
                  {t.fee && <span className="ml-2 text-brand-400">{t.fee}</span>}
                </div>
              </div>
              <div className="text-xs text-white/30 shrink-0">{t.date ? new Date(t.date).toLocaleDateString('pt-BR') : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
