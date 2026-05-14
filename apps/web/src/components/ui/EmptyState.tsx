import { SearchX, Calendar } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'calendar';
}

export function EmptyState({ title = 'Nenhum resultado', description = 'Tente ajustar seus filtros ou volte mais tarde.', icon = 'search' }: EmptyStateProps) {
  const Icon = icon === 'calendar' ? Calendar : SearchX;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-white/5 p-5">
        <Icon className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">{title}</h3>
      <p className="mt-1 text-sm text-white/40 max-w-xs">{description}</p>
    </div>
  );
}
