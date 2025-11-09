import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserSettings } from '../hooks/useUserSettings';
import '../styles/pages/Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const username = user?.username || localStorage.getItem('username') || '';
  const userId = username || 'user1';

  // ----- SETTINGS (theme/language/region/newsletter) -----
  const {
    data: settingsResp,
    isLoading,
    isError,
    save: saveSettings,
    saveStatus,
  } = useUserSettings(username);

  const initialSettings = useMemo(
    () => ({
      theme: 'dark',
      language: 'ru',
      region: 'KZ',
      newsletter: false,
      ...(settingsResp?.data || {}),
    }),
    [settingsResp]
  );

  const [settings, setSettings] = useState(initialSettings);
  useEffect(() => setSettings(initialSettings), [initialSettings]);

  const handleSaveSettings = async () => {
    try {
      await saveSettings(settings);
    } catch {
      /* ошибки обрабатываются в хуке */
    }
  };

  const handleLogout = () => {
    logout?.();
    ['favorites_', 'profile_', 'history_'].forEach((p) =>
      localStorage.removeItem(`${p}${userId}`)
    );
    navigate('/login');
  };

  return (
    <div className="settings-page">
      {isLoading && <div className="loading">Загрузка…</div>}
      {isError && <div className="error">Ошибка загрузки настроек</div>}

      <div className="settings-container">
        {/* Настройки просмотра */}
        <div className="settings-section">
          <h2>Настройки просмотра</h2>

          <div className="settings-grid">
            <Link to="/history" className="setting-tile">📜 История просмотров</Link>
            <Link to="/favorites" className="setting-tile">⭐ Избранные</Link>

            <div className="setting-row">
              <label className="setting-label">Тема</label>
              <select
                className="setting-input"
                value={settings.theme}
                onChange={(e) => setSettings((s) => ({ ...s, theme: e.target.value }))}
              >
                <option value="dark">Тёмная</option>
                <option value="light">Светлая</option>
              </select>
            </div>

            <div className="setting-row">
              <label className="setting-label">Язык</label>
              <select
                className="setting-input"
                value={settings.language}
                onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
              >
                <option value="ru">Русский</option>
                <option value="kk">Қазақша</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="setting-row">
              <label className="setting-label">Регион</label>
              <input
                className="setting-input"
                value={settings.region}
                onChange={(e) => setSettings((s) => ({ ...s, region: e.target.value }))}
              />
            </div>

            <div className="setting-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={!!settings.newsletter}
                  onChange={(e) => setSettings((s) => ({ ...s, newsletter: e.target.checked }))}
                />
                Подписка на рассылку
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              className="btn btn-primary"
              disabled={saveStatus === 'loading'}
            >
              {saveStatus === 'loading' ? 'Сохранение…' : 'Сохранить настройки'}
            </button>
          </div>
        </div>

        {/* Прочее */}
        <div className="settings-section">
          <h2>Прочее</h2>
          <div className="settings-grid">
            <Link to="/analytics" className="setting-tile">📊 Аналитика</Link>
            <Link to="/subscription" className="setting-tile">💰 Подписка</Link>
            <div className="setting-tile">💳 Привязанная карта</div>
            <div className="setting-tile">❓ FAQ</div>
          </div>
        </div>

        {/* Управление аккаунтом */}
        <div className="settings-section">
          <h2>Управление аккаунтом</h2>
          <div className="settings-grid">
            <button className="btn btn-danger" onClick={handleLogout}>Выйти</button>
          </div>
        </div>
      </div>
    </div>
  );
}
