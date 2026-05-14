import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAQizaAp9-3GaRXv6Pagh5hTKtENAu1mRA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'aposta-1fee6.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'aposta-1fee6',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'aposta-1fee6.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '406039558198',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:406039558198:web:8c7ded1a5c2e5aba3dc097',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-S34NQ692H9',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

isSupported().then((ok) => ok && getAnalytics(app)).catch(() => null);
