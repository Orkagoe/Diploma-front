// src/pages/History.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import '../styles/pages/History.css';

const History = () => {
  const navigate = useNavigate();
  const { history } = useHistory();

  const handleItemClick = (id, type) => {
    console.log(`Переход к ${type}/movie/${id}`);
    navigate(`/${type}/movie/${id}`);
  };

  // Форматирование времени просмотра
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <div className="history-page">
        <div className="history-header">
          <h1>📜 История</h1>
          <p>0 записей</p>
        </div>
        <div className="empty-state">
          <h3>История пуста</h3>
          <p>Посетите фильмы, сериалы или аниме, чтобы начать</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>📜 История</h1>
        <p>{history.length} записей</p>
      </div>
      <div className="history-grid">
        {history.map(item => (
          <div
            key={item.id}
            className="history-card"
            onClick={() => handleItemClick(item.id, item.type)}
          >
            <img
              src={item.thumbnailUrl || '/placeholder.jpg'}
              alt={item.title}
              className="history-image"
            />
            <div className="history-info">
              <h3 className="history-title">{item.title}</h3>
              <p className="history-type">
                {item.type === 'movie' ? 'Фильм' : item.type === 'series' ? 'Сериал' : 'Аниме'}
              </p>
              <p className="history-timestamp">Просмотрено: {formatTimestamp(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;