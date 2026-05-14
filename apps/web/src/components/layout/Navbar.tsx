import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, Settings, Star, User, LayoutDashboard, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export function Navbar() {
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 border border-brand-500/40">
            <Brain className="h-5 w-5 text-brand-400" />
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:block">
            Bet<span className="text-brand-400">Intel</span> AI
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <NavLink to="/matches" icon={<Star className="h-4 w-4" />} label="Partidas" />
          <NavLink to="/favorites" icon={<Star className="h-4 w-4" />} label="Favoritos" />
          {profile?.role === 'admin' && (
            <NavLink to="/admin" icon={<Shield className="h-4 w-4" />} label="Admin" />
          )}
        </nav>

        {/* User */}
        {user && (
          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn-ghost p-2">
              <Settings className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 px-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName ?? ''} className="h-7 w-7 rounded-full border border-white/20" />
              ) : (
                <div className="h-7 w-7 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand-400" />
                </div>
              )}
              <span className="text-sm text-white/70 hidden lg:block">{user.displayName ?? user.email}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost p-2 text-white/50 hover:text-red-400">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
      {icon}
      {label}
    </Link>
  );
}
