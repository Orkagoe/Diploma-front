// src/hooks/useAuth.js
import { useSyncExternalStore } from 'react';

// ----- глобальный стор -----
const listeners = new Set();

function readFromLS() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  return token && username ? { token, username, role } : null;
}

const store = {
  user: readFromLS(),
  setUser(u) { this.user = u; emit(); },
};

function emit() { for (const l of listeners) l(); }
function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function getSnapshot() { return store.user; }

// ----- публичный хук -----
export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot);

  const login = (token, username, role = 'ROLE_USER') => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    store.setUser({ token, username, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    store.setUser(null);
  };

  return { user, login, logout };
}
