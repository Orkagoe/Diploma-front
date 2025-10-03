// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/pages/Analytics.css';

// Регистрация компонентов Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const navigate = useNavigate();
  const userId = 'user1'; // Пример ID пользователя
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Мок-данные (замените на реальный API-запрос)
        const mockAnalytics = {
          registeredDate: '2024-05-15',
          totalTimeWatched: '120 часов',
          totalWatched: { movies: 15, anime: 10, series: 8 },
          kazakhContentTime: '40 часов',
          kazakhContentTotal: 12,
          bestContent: 'Көшпенділер (2018)',
          reviewsCount: 5,
          averageRatingData: { 1: 1, 3: 2, 5: 2 },
          averageReviewWords: 25,
          favoritesCount: 7,
          lastMonthTime: { hours: 20 },
          timeBreakdown: { movies: 50, anime: 30, series: 20 },
          topGenres: ['Drama', 'Action', 'Comedy'],
        };
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError('Не удалось загрузить аналитику');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [userId]);

  if (loading) return <div className="loading">Загрузка аналитики...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!analytics) return <div className="error">Аналитика недоступна</div>;

  // Данные для диаграммы "Время за последний месяц"
  const monthChartData = {
    labels: ['Последний месяц'],
    datasets: [
      {
        label: 'Часы',
        data: [analytics.lastMonthTime.hours],
        backgroundColor: '#4a90e2',
        borderColor: '#357abd',
        borderWidth: 1,
      },
    ],
  };

  // Данные для диаграммы "Соотношение времени"
  const timeBreakdownData = {
    labels: ['Кино', 'Аниме', 'Сериалы'],
    datasets: [
      {
        data: [
          analytics.timeBreakdown.movies,
          analytics.timeBreakdown.anime,
          analytics.timeBreakdown.series,
        ],
        backgroundColor: ['#4a90e2', '#ff6b6b', '#50c878'],
        borderWidth: 1,
      },
    ],
  };

  // Данные для диаграммы "Оценки"
  const ratingData = {
    labels: ['1 звезда', '3 звезды', '5 звезд'],
    datasets: [
      {
        label: 'Оценки',
        data: [
          analytics.averageRatingData[1] || 0,
          analytics.averageRatingData[3] || 0,
          analytics.averageRatingData[5] || 0,
        ],
        backgroundColor: ['#ff6b6b', '#ffcc00', '#50c878'],
        borderColor: ['#ff8787', '#e6b800', '#45b76b'],
        borderWidth: 1,
      },
    ],
  };

  // Опции для диаграмм
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <h1>📊 Аналитика</h1>
        <div className="analytics-content">
          <div className="analytics-left">
            <div className="analytics-item">
              <h2>Общая информация</h2>
              <p>Дата регистрации: {analytics.registeredDate}</p>
              <p>Всего просмотрено: {analytics.totalTimeWatched}</p>
              <ul>
                <li>Кино: {analytics.totalWatched.movies}</li>
                <li>Аниме: {analytics.totalWatched.anime}</li>
                <li>Сериалы: {analytics.totalWatched.series}</li>
              </ul>
              <p>Казахский контент: {analytics.kazakhContentTotal} фильмов ({analytics.kazakhContentTime})</p>
              <p>Лучший контент: {analytics.bestContent}</p>
              <p>Оставлено отзывов: {analytics.reviewsCount}</p>
              <p>Среднее слов в отзыве: {analytics.averageReviewWords}</p>
              <p>В избранном: {analytics.favoritesCount}</p>
            </div>
          </div>
          <div className="analytics-right">
            <div className="chart-block">
              <h3>Время за последний месяц</h3>
              <div style={{ height: '200px' }}>
                <Bar data={monthChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-block">
              <h3>Соотношение времени (Кино/Аниме/Сериалы)</h3>
              <div style={{ height: '200px' }}>
                <Doughnut data={timeBreakdownData} options={doughnutOptions} />
              </div>
            </div>

            <div className="chart-block">
              <h3>Оценки пользователей</h3>
              <div style={{ height: '200px' }}>
                <Bar data={ratingData} options={chartOptions} />
              </div>
            </div>

            {analytics.topGenres.map((genre, index) => {
              const genreData = {
                labels: ['Просмотры'],
                datasets: [
                  {
                    label: genre,
                    data: [Math.floor(Math.random() * 10) + 5],
                    backgroundColor: ['#4a90e2', '#ff6b6b', '#50c878'][index % 3],
                    borderColor: ['#357abd', '#ff8787', '#45b76b'][index % 3],
                    borderWidth: 1,
                  },
                ],
              };
              return (
                <div key={genre} className="chart-block">
                  <h3>Жанр: {genre}</h3>
                  <div style={{ height: '200px' }}>
                    <Bar data={genreData} options={chartOptions} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;