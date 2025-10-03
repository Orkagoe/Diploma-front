// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const userId = 'user1'; // Пример ID пользователя, можно заменить на реальный
  const [profile, setProfile] = useState({
    username: 'Пользователь',
    email: 'user@example.com',
    favoriteGenres: ['Action', 'Comedy', 'Drama'], // Пример любимых жанров
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Симуляция загрузки данных (замени на реальный API)
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const savedProfile = localStorage.getItem(`profile_${userId}`);
        const initialProfile = savedProfile
          ? JSON.parse(savedProfile)
          : {
              username: 'Пользователь',
              email: 'user@example.com',
              favoriteGenres: ['Action', 'Comedy', 'Drama'],
            };
        setProfile(initialProfile);
      } catch (err) {
        setError('Не удалось загрузить настройки');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const handleSaveProfile = () => {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    console.log('Профиль сохранён:', profile);
    alert('Настройки сохранены!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    // Логика выхода (очищаем localStorage и перенаправляем на /login)
    localStorage.removeItem(`favorites_${userId}`);
    localStorage.removeItem(`profile_${userId}`);
    localStorage.removeItem(`history_${userId}`);
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Загрузка настроек...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Профиль пользователя */}
        <div className="user-profile">
          <div className="profile-image">
            <img src="/placeholder.jpg" alt="User Avatar" />
          </div>
          <div className="profile-details">
            <div className="profile-row">Имя пользователя: {profile.username}</div>
            <div className="profile-row">Аккаунт: {profile.email}</div>
            <div className="profile-row">
              Любимые жанры:
              <div className="genres-container">
                {profile.favoriteGenres.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr className="separator" />

        {/* Первый контейнер: Настройки просмотра */}
        <div className="settings-section">
          <h2>Настройки просмотра</h2>
          <div className="settings-grid">
            <Link to="/history" className="setting-item">📜 История просмотров</Link>
            <div className="setting-item">🎵 Сохраненные плейлисты</div>
            <Link to="/favorites" className="setting-item">⭐ Избранные кино/сериалы</Link>
          </div>
        </div>

        {/* Второй контейнер: Личная информация и подписка */}
        <div className="settings-section">
          <h2>Личная информация и подписка</h2>
          <div className="settings-grid">
            <div className="setting-item">🌐 Язык и регион</div>
            <div className="setting-item">💰 Подписка</div>
            <Link to="/analytics" className="setting-item">📊 Аналитика</Link>
            <div className="setting-item">💳 Привязанная карта</div>
          </div>
        </div>

        {/* Третий контейнер: Мерч и поддержка */}
        <div className="settings-section">
          <h2>Мерч и поддержка</h2>
          <div className="settings-grid">
            <div className="setting-item">🛍️ Мерч</div>
            <div className="setting-item">🙌 Поддержка автора</div>
            <div className="setting-item">🌱 Развитие сайта</div>
            <div className="setting-item">🤝 Сотрудничество</div>
          </div>
        </div>

        {/* Четвертый контейнер: Помощь и FAQ */}
        <div className="settings-section">
          <h2>Помощь и документация</h2>
          <div className="settings-grid">
            <div className="setting-item">❓ Вопросы FAQ</div>
            <div className="setting-item">🛠️ Помощь</div>
            <div className="setting-item">📩 Обратная связь</div>
            <div className="setting-item">📜 Лицензионное соглашение</div>
          </div>
        </div>

        {/* Пятый контейнер: Выход */}
        <div className="settings-section">
          <h2>Управление аккаунтом</h2>
          <div className="settings-grid">
            <button className="logout-btn" onClick={handleLogout}>
               Выйти
            </button>
          </div>
        </div>

        {/* Дополнительная секция: Редактирование профиля */}
        <div className="settings-section">
          <h2>Редактировать профиль</h2>
          <div className="settings-grid">
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              placeholder="Имя пользователя"
              className="setting-input"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="setting-input"
            />
            <button onClick={handleSaveProfile} className="save-btn">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;