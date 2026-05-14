import { Settings, User, Bell, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function SettingsPage() {
  const { user, profile } = useAuthStore();

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-white/40 text-sm">Gerencie sua conta</p>
        </div>
      </div>

      {/* Profile */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-brand-400" /> Perfil</h2>
        <div className="grid gap-3">
          <div>
            <label className="text-xs text-white/40 block mb-1">Nome</label>
            <div className="input">{user?.displayName ?? '–'}</div>
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">E-mail</label>
            <div className="input">{user?.email ?? '–'}</div>
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Plano</label>
            <div className="input capitalize">{profile?.plan ?? 'free'}</div>
          </div>
        </div>
      </div>

      {/* Plan info */}
      <div className="card p-5 border-brand-500/20">
        <h2 className="font-semibold flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-brand-400" /> Plano Atual</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg capitalize text-brand-400">{profile?.plan ?? 'Free'}</div>
            <p className="text-white/40 text-sm">Acesso às análises estatísticas básicas</p>
          </div>
          <button className="btn-primary text-sm">Upgrade</button>
        </div>
      </div>
    </div>
  );
}
