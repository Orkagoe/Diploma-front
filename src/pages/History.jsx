// src/pages/History.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext'; // Импорт хука
import '../styles/pages/History.css';

const History = () => {
  const navigate = useNavigate();
  const { history } = useHistory(); // Получаем историю из контекста

  const handleItemClick = (id, type) => {
    navigate(`/${type}/movie/${id}`);
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
          <p>Посетите фильмы или аниме, чтобы начать</p>
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
              <p className="history-type">{item.type === 'movie' ? 'Фильм' : 'Аниме'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;