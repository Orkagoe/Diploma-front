import React, { useState, useEffect } from 'react';
import { useUserSettings } from '../hooks/useUserSettings';
import { useAuth } from '../hooks/useAuth'; // предполагается, что у тебя есть хук аутентификации

export default function SettingsPage() {
  const { user } = useAuth();
  const username = user?.username;
  const { data, isLoading, isError, save, saveStatus } = useUserSettings(username);
  const [local, setLocal] = useState({ theme: 'dark', language: 'ru', region: 'KZ', newsletter: false });

  useEffect(() => {
    if (data?.data) {
      setLocal(prev => ({ ...prev, ...data.data }));
    }
  }, [data]);

  const onSave = async () => {
    try {
      await save(local);
      alert('Настройки сохранены');
    } catch (e) {
      alert('Ошибка: ' + e.message);
    }
  };

  if (!username) return <p>Войдите, чтобы редактировать настройки</p>;
  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <div className="settings-page container">
      <h1>Настройки</h1>
      <div className="settings-grid">
        <label>
          Тема
          <select value={local.theme} onChange={(e) => setLocal({...local, theme: e.target.value})}>
            <option value="dark">Тёмная</option>
            <option value="light">Светлая</option>
          </select>
        </label>
        <label>
          Язык
          <select value={local.language} onChange={(e) => setLocal({...local, language: e.target.value})}>
            <option value="ru">Русский</option>
            <option value="kk">Қазақша</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          Регион
          <input value={local.region} onChange={(e) => setLocal({...local, region: e.target.value})} />
        </label>
        <label>
          Подписка на рассылку
          <input type="checkbox" checked={!!local.newsletter} onChange={(e) => setLocal({...local, newsletter: e.target.checked})} />
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={onSave} className="button">{saveStatus === 'loading' ? 'Сохранение...' : 'Сохранить'}</button>
      </div>
    </div>
  );
}
