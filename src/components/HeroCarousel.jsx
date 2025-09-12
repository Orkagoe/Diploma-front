import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/HeroCarousel.css';

const HeroCarousel = ({ items = [], isLoading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayDelay = 5000;
  const starsCanvasRefLeft = useRef(null);
  const starsCanvasRefRight = useRef(null);
  const navigate = useNavigate();

  const defaultItems = [
    { id: 1, title: 'Крестный отец', image: 'https://via.placeholder.com/800x450/ff6b6b/fff?text=Крестный+отец', type: 'movie', year: '1972', rating: 9.2, genre: 'Криминал, Драма' },
    { id: 2, title: 'Наруто', image: 'https://via.placeholder.com/800x450/4ecdc4/fff?text=Наруто', type: 'anime', year: '2002', rating: 8.3, genre: 'Аниме, Приключения' },
    { id: 3, title: 'Интерстеллар', image: 'https://via.placeholder.com/800x450/45b7d1/fff?text=Интерстеллар', type: 'movie', year: '2014', rating: 8.6, genre: 'Фантастика, Драма' },
    { id: 4, title: 'Аватар: Легенда об Аанге', image: 'https://via.placeholder.com/800x450/f9ca24/fff?text=Аватар', type: 'anime', year: '2005', rating: 9.3, genre: 'Аниме, Фэнтези' },
    { id: 5, title: 'Во все тяжкие', image: 'https://via.placeholder.com/800x450/eb4d4b/fff?text=Во+все+тяжкие', type: 'series', year: '2008', rating: 9.5, genre: 'Криминал, Драма' },
    { id: 6, title: 'Ходячий замок', image: 'https://via.placeholder.com/800x450/6c5ce7/fff?text=Ходячий+замок', type: 'anime', year: '2004', rating: 8.9, genre: 'Аниме, Фэнтези' },
    { id: 7, title: 'Джентльмены', image: 'https://via.placeholder.com/800x450/00b894/fff?text=Джентльмены', type: 'movie', year: '2019', rating: 8.5, genre: 'Криминал, Комедия' },
    { id: 8, title: 'Атака титанов', image: 'https://via.placeholder.com/800x450/dfe6e9/000?text=Атака+титанов', type: 'anime', year: '2013', rating: 9.7, genre: 'Аниме, Экшен' },
  ];

  const carouselItems = items.length > 0 ? items : defaultItems;

  const getPrevIndex = useCallback(
    () => (currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1),
    [currentIndex, carouselItems.length]
  );

  const getNextIndex = useCallback(
    () => (currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1),
    [currentIndex, carouselItems.length]
  );

  // ⭐ Функция генерации звезд
  const initStars = (canvas) => {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 100;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  };

  // 🎇 Запуск звезд по бокам
  useEffect(() => {
    const cleanupLeft = starsCanvasRefLeft.current ? initStars(starsCanvasRefLeft.current) : null;
    const cleanupRight = starsCanvasRefRight.current ? initStars(starsCanvasRefRight.current) : null;

    return () => {
      if (cleanupLeft) cleanupLeft();
      if (cleanupRight) cleanupRight();
    };
  }, []);

  // Автопрокрутка
  useEffect(() => {
    if (!autoPlay || carouselItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, autoPlayDelay);
    return () => clearInterval(interval);
  }, [autoPlay, carouselItems.length]);

  const goToPrev = useCallback(() => {
    if (carouselItems.length <= 1) return;
    setCurrentIndex(getPrevIndex());
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), autoPlayDelay);
  }, [getPrevIndex, carouselItems.length]);

  const goToNext = useCallback(() => {
    if (carouselItems.length <= 1) return;
    setCurrentIndex(getNextIndex());
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), autoPlayDelay);
  }, [getNextIndex, carouselItems.length]);

  const goToIndex = useCallback(
    (index) => {
      if (carouselItems.length <= 1) return;
      setCurrentIndex(index);
      setAutoPlay(false);
      setTimeout(() => setAutoPlay(true), autoPlayDelay);
    },
    [carouselItems.length]
  );

  const handleItemClick = (item) => {
    navigate(`/${item.type}/movie/${item.id}`);
  };

  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="hero-carousel loading">
        <canvas ref={starsCanvasRefLeft} className="stars-canvas left"></canvas>
        <canvas ref={starsCanvasRefRight} className="stars-canvas right"></canvas>
        <div className="carousel-content-wrapper">
          <div className="carousel-header">
            <h2>Популярные фильмы</h2>
            <p>Загрузка контента...</p>
          </div>
          <div className="carousel-skeleton">
            <div className="skeleton-item"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- EMPTY ---
  if (!carouselItems || carouselItems.length === 0) {
    return (
      <div className="hero-carousel empty">
        <canvas ref={starsCanvasRefLeft} className="stars-canvas left"></canvas>
        <canvas ref={starsCanvasRefRight} className="stars-canvas right"></canvas>
        <div className="carousel-content-wrapper">
          <div className="carousel-header">
            <h2>Популярные фильмы</h2>
            <p>Фильмы не найдены</p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ---
  return (
    <div className="hero-carousel">
      <canvas ref={starsCanvasRefLeft} className="stars-canvas left"></canvas>
      <canvas ref={starsCanvasRefRight} className="stars-canvas right"></canvas>
      <div className="carousel-content-wrapper">
        <div className="carousel-header">
          <h2>🎬 ПОПУЛЯРНОЕ И РЕКОМЕНДУЕМОЕ</h2>
          <p>Самые популярные фильмы и аниме этой недели</p>
        </div>
        <div
          className="carousel-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {carouselItems.length > 1 && (
            <>
              <button className="carousel-btn prev" onClick={goToPrev}>
                ‹
              </button>
              <button className="carousel-btn next" onClick={goToNext}>
                ›
              </button>
            </>
          )}
          <div className="carousel">
            {carouselItems.map((item, index) => {
              let position = '';
              if (index === currentIndex) position = 'active';
              else if (index === getPrevIndex()) position = 'prev';
              else if (index === getNextIndex()) position = 'next';
              return (
                <div
                  key={item.id || index}
                  className={`carousel-item ${position}`}
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.poster_path || item.image}
                    alt={item.title || item.name}
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/300x400/333/fff?text=No+Image';
                    }}
                  />
                  <div className="carousel-content">
                    <h3>{item.title || item.name}</h3>
                    <div className="item-meta">
                      {item.genre && <span className="genre">{item.genre}</span>}
                      {item.year || item.release_date ? (
                        <span className="year">
                          {item.year || new Date(item.release_date).getFullYear()}
                        </span>
                      ) : null}
                      {item.rating || item.vote_average ? (
                        <span className="rating">
                          ⭐ {(item.rating || item.vote_average).toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                    <button className="watch-btn">Смотреть сейчас</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {carouselItems.length > 1 && (
          <div className="carousel-dots">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;
