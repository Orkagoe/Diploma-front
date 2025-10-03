// src/pages/AuthorPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/pages/AuthorPage.css';

const AuthorPage = ({ authorId }) => {
  const navigate = useNavigate();

  // Данные автора
  const authorData = {
    id: authorId || 1,
    username: "AuthorName",
    avatar: "/path/to/avatar.jpg",
    awards: ["Best Director 2023", "Film Festival Winner", "Critics Choice"],
    bannerWork: {
      title: "Бойцовский клуб",
      description: "Культовый фильм Дэвида Финчера...",
      image: "/path/to/banner.jpg"
    },
    movies: [
      { id: 1, title: "Фильм 1", poster: "/path/to/movie1.jpg" },
      { id: 2, title: "Фильм 2", poster: "/path/to/movie2.jpg" },
      { id: 3, title: "Фильм 3", poster: "/path/to/movie3.jpg" },
      // Добавь больше фильмов по необходимости
    ],
    isSubscribed: false
  };

  // Состояния
  const [isSubscribed, setIsSubscribed] = useState(authorData.isSubscribed);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Обработчики
  const handleSubscribeToggle = () => {
    setShowConfirmationModal(true);
  };

  const confirmSubscription = () => {
    setIsSubscribed(!isSubscribed);
    setShowConfirmationModal(false);
    console.log(`Subscription toggled to ${!isSubscribed} for author ${authorData.id}`);
  };

  const cancelSubscription = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="author-page">
      {/* Верхняя секция - профиль автора */}
      <div className="author-header">
        <div className="author-avatar">
          <img src={authorData.avatar} alt={authorData.username} />
        </div>
        <div className="author-info">
          <h1>{authorData.username}</h1>
          <div className="awards">
            {authorData.awards.map((award, index) => (
              <span key={index} className="award-badge">{award}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Баннер с лучшим произведением (Page 4) */}
      <div className="author-banner">
        <div className="banner-content">
          <div className="banner-main">
            <h2>{authorData.bannerWork.title}</h2>
            <p>{authorData.bannerWork.description}</p>
          </div>
          <div className="banner-club">
            <h3>Клуб подписчиков</h3>
            <button 
              className="subscribe-btn"
              onClick={handleSubscribeToggle}
            >
              {isSubscribed ? 'Отписаться' : 'Подписаться'}
            </button>
          </div>
        </div>
      </div>
      {/* Сетка с остальными фильмами (Page 4) */}
      <div className="movie-grid">
        {authorData.movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.poster} alt={movie.title} />
            <span className="movie-title">{movie.title}</span>
          </div>
        ))}
      </div>
      {/* Модальное окно для подтверждения подписки */}
      {showConfirmationModal && (
        <Modal 
          message={isSubscribed ? "Вы уверены, что хотите отписаться?" : "Подписаться на автора?"}
          onConfirm={confirmSubscription}
          onCancel={cancelSubscription}
        />
      )}
    </div>
  );
};

export default AuthorPage;