import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    // простой поиск: переходим на домашнюю с query param
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
        </nav>
      </div>
    </header>
  );
}
