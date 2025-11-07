import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login as apiLogin } from '../shared/api/auth';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const from = loc.state?.from?.pathname || '/';

  const m = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      const role = data.role || 'ROLE_USER';
      login(data.token, data.username, role);
      nav(from, { replace: true });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    m.mutate(form);
  };

  return (
    <div className="container">
      <h1>Вход</h1>
      {m.error && <p className="error">{m.error.message}</p>}
      <form onSubmit={submit} className="auth-form">
        <input
          className="input"
          placeholder="Логин"
          value={form.username}
          onChange={(e)=>setForm({...form, username: e.target.value})}
          autoComplete="username"
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e)=>setForm({...form, password: e.target.value})}
          autoComplete="current-password"
          required
        />
        <button className="button" disabled={m.isLoading}>{m.isLoading ? 'Входим...' : 'Войти'}</button>
      </form>
    </div>
  );
}
