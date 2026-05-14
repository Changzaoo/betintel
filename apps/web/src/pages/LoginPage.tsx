import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';

type Mode = 'login' | 'register';

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithGoogle, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password, name);
      navigate('/dashboard');
    } catch {
      /* error shown via store */
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    clearError();
    await loginWithGoogle();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-500/20 border border-brand-500/40 mb-4">
            <Brain className="h-8 w-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold">
            Bet<span className="text-brand-400">Intel</span> AI
          </h1>
          <p className="text-white/40 mt-1 text-sm">Análise estatística avançada para futebol</p>
        </div>

        {/* Card */}
        <div className="card p-6 space-y-5">
          {/* Tabs */}
          <div className="flex rounded-lg bg-white/5 p-1">
            <button onClick={() => { setMode('login'); clearError(); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'login' ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white'}`}>
              Entrar
            </button>
            <button onClick={() => { setMode('register'); clearError(); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'register' ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white'}`}>
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className="input pl-9 w-full" />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="input pl-9 w-full" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input type={showPwd ? 'text' : 'password'} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input pl-9 pr-9 w-full" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </button>
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          Análise baseada em estatísticas. Não garante resultados. Aposte com responsabilidade.
        </p>
      </motion.div>
    </div>
  );
}
