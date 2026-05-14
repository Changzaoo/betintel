import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { UserProfile } from '@betintel/shared';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  init: () => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        set({ user, profile: snap.data() as UserProfile ?? null, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
    return unsub;
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      set({ error: 'Email ou senha incorretos', loading: false });
      throw new Error('Credenciais inválidas');
    }
  },

  loginWithGoogle: async () => {
    set({ error: null, loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await ensureUserProfile(result.user);
    } catch {
      set({ error: 'Erro ao entrar com Google', loading: false });
    }
  },

  register: async (email, password, name) => {
    set({ error: null, loading: true });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await ensureUserProfile(result.user, name);
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes('email-already-in-use')
        ? 'Este e-mail já está cadastrado'
        : 'Erro ao criar conta';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
  },

  clearError: () => set({ error: null }),
}));

async function ensureUserProfile(user: User, name?: string) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: name ?? user.displayName ?? 'Usuário',
      email: user.email,
      photoURL: user.photoURL,
      role: 'free',
      plan: 'free',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  }
}
