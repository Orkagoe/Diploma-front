// src/pages/Authors.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Authors.css';

const Authors = () => {
  const navigate = useNavigate();

  // Статический список авторов, отсортированный по популярности (от 100 до 10)
  const authors = Array.from({ length: 35 }, (_, index) => ({
    id: index + 1,
    username: `Author${index + 1}`,
    avatar: `/path/to/avatar${(index % 5) + 1}.jpg`, // Циклические аватары для примера
    popularity: 100 - (index * 2.5) // Популярность от 100 до 10
  })).sort((a, b) => b.popularity - a.popularity); // Сортировка по убыванию

  const handleAuthorClick = (id) => {
    navigate(`/author/${id}`);
  };

  return (
    <div className="authors-page">
      <h1>Популярные авторы</h1>
      <div className="authors-grid">
        {authors.map((author) => (
          <div 
            key={author.id} 
            className="author-card" 
            onClick={() => handleAuthorClick(author.id)}
          >
            <div className="author-avatar">
              <img src={author.avatar} alt={author.username} />
            </div>
            <div className="author-details">
              <h2>{author.username}</h2>
              <p>Популярность: {author.popularity.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Authors;