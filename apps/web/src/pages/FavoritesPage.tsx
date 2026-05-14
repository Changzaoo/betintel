import { Star } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export function FavoritesPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Star className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold">Favoritos</h1>
          <p className="text-white/40 text-sm">Times e partidas que você segue</p>
        </div>
      </div>
      <EmptyState icon="search" title="Nenhum favorito ainda" description="Acesse uma partida ou time e marque como favorito para acompanhar aqui." />
    </div>
  );
}
