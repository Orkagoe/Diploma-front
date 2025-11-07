import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const submit = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">Cinema App</Link>

        <form className="search-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Поиск по названию или жанру..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        <nav>
          <Link to="/genres" className="link">Жанры</Link>
          <Link to="/favorites" className="link">Избранное</Link>
          <Link to="/history" className="link">История</Link>
          <Link to="/add-movie" className="link">Добавить</Link>

          {user ? (
            <>
              <Link to="/profile" className="link">@{user.username}</Link>
              <button
                onClick={logout}
                className="link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">Войти</Link>
              <Link to="/register" className="link">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
