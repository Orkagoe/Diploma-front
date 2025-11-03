import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const username = user?.username;
  const { data, isLoading, isError, saveProfile } = useUserProfile(username);
  const [form, setForm] = useState({ displayName: '', email: '', avatarUrl: '', favoriteGenres: [] });

  useEffect(() => {
    if (data) {
      setForm({
        displayName: data.displayName || '',
        email: data.email || '',
        avatarUrl: data.avatarUrl || '',
        favoriteGenres: data.favoriteGenres || []
      });
    }
  }, [data]);

  const onSave = async () => {
    try {
      await saveProfile(form);
      alert('Профиль сохранён');
    } catch (e) {
      alert('Ошибка: ' + e.message);
    }
  };

  if (!username) return <p>Войдите для управления профилем</p>;
  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка</p>;

  return (
    <div className="container profile-page">
      <h1>Профиль</h1>
      <label>
        Имя
        <input value={form.displayName} onChange={(e) => setForm({...form, displayName: e.target.value})} />
      </label>
      <label>
        Email
        <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
      </label>
      <label>
        Аватар URL
        <input value={form.avatarUrl} onChange={(e) => setForm({...form, avatarUrl: e.target.value})} />
      </label>
      <label>
        Любимые жанры (через запятую)
        <input value={(form.favoriteGenres || []).join(', ')} onChange={(e) => setForm({...form, favoriteGenres: e.target.value.split(',').map(s => s.trim())})} />
      </label>
      <div style={{ marginTop: 12 }}>
        <button onClick={onSave} className="button">Сохранить профиль</button>
      </div>
    </div>
  );
}
