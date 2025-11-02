import React from 'react';
import { Link } from 'react-router-dom';

const KEY = 'watch_history_guest';

export function useHistoryStorage() {
  const push = (item) => {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const existing = arr.filter(i => i.imdbId !== item.imdbId);
    existing.unshift(item);
    const truncated = existing.slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(truncated));
  };
  const read = () => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  };
  const clear = () => localStorage.removeItem(KEY);
  return { push, read, clear };
}

export default function History(){
  const { read, clear } = useHistoryStorage();
  const items = read();

  if (!items.length) {
    return <div className="container"><h1>История</h1><p>Пока нет записей</p></div>;
  }

  return (
    <div className="container">
      <h1>История</h1>
      <button onClick={clear} className="button button--ghost">Очистить</button>
      <div className="history-grid" style={{marginTop:16}}>
        {items.map(i => (
          <Link key={i.imdbId} to={`/movie/${i.imdbId}`} className="history-card">
            <img src={i.posterUrl || `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(i.title)}`} width="120" loading="lazy" />
            <div>
              <h3>{i.title}</h3>
              <div>{new Date(i.timestamp).toLocaleString()}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
