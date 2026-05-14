import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Erro ao carregar dados', description = 'Não foi possível buscar as informações. Verifique se o servidor está rodando.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-red-500/10 p-5">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">{title}</h3>
      <p className="mt-1 text-sm text-white/40 max-w-xs">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="h-4 w-4" /> Tentar novamente
        </button>
      )}
    </div>
  );
}
