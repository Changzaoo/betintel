import { useState } from 'react';
import { Shield, RefreshCw, Database, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export function AdminPage() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');

  const cacheStats = useQuery({
    queryKey: ['cache-stats'],
    queryFn: () => api.cache.stats().then((r) => r.data),
    refetchInterval: 30000,
  });

  if (profile?.role !== 'admin') {
    return (
      <div className="card p-8 text-center space-y-3">
        <Shield className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold">Acesso restrito</h2>
        <p className="text-white/40">Apenas administradores podem acessar esta página.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Voltar ao Dashboard</button>
      </div>
    );
  }

  const handleRefreshCache = async (prefix?: string) => {
    setRefreshing(true);
    try {
      await api.cache.refresh(prefix);
      setRefreshMsg('Cache limpo com sucesso!');
      cacheStats.refetch();
    } catch {
      setRefreshMsg('Erro ao limpar cache');
    } finally {
      setRefreshing(false);
      setTimeout(() => setRefreshMsg(''), 3000);
    }
  };

  const stats = (cacheStats.data as { data?: { size?: number; keys?: string[] } } | undefined)?.data;

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-white/40 text-sm">Gerenciamento da plataforma</p>
        </div>
      </div>

      {/* API Status */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-brand-400" /> Status das APIs</h2>
        <div className="space-y-2">
          <ApiStatusRow name="API-Football" active={Boolean(import.meta.env.VITE_API_FOOTBALL_KEY)} />
          <ApiStatusRow name="SportMonks" active={false} note="Adapter preparado" />
          <ApiStatusRow name="Sportradar" active={false} note="Adapter preparado" />
          <ApiStatusRow name="Mock Provider" active={true} note="Fallback ativo" />
        </div>
      </div>

      {/* Cache */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Database className="h-4 w-4 text-brand-400" /> Gerenciamento de Cache</h2>

        {refreshMsg && (
          <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg px-3 py-2 text-sm text-brand-400">
            {refreshMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold tabular-nums">{stats?.size ?? '–'}</div>
            <div className="text-xs text-white/40">Entradas em cache</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold tabular-nums">{stats?.keys?.length ?? '–'}</div>
            <div className="text-xs text-white/40">Chaves ativas</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleRefreshCache()} disabled={refreshing} className="btn-secondary text-sm flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Limpar todo cache
          </button>
          <button onClick={() => handleRefreshCache('upcoming')} disabled={refreshing} className="btn-ghost text-sm">Limpar fixtures</button>
          <button onClick={() => handleRefreshCache('teamform')} disabled={refreshing} className="btn-ghost text-sm">Limpar form</button>
          <button onClick={() => handleRefreshCache('prediction')} disabled={refreshing} className="btn-ghost text-sm">Limpar análises</button>
        </div>
      </div>
    </div>
  );
}

function ApiStatusRow({ name, active, note }: { name: string; active: boolean; note?: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
      {active ? <CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> : <XCircle className="h-4 w-4 text-red-400/50 shrink-0" />}
      <span className="text-sm font-medium flex-1">{name}</span>
      <span className="text-xs text-white/30">{active ? 'Ativo' : note ?? 'Inativo'}</span>
    </div>
  );
}
