import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails, getMovieReviews } from '../utils/api'
import '../styles/pages/MovieDetails.css'

const MovieDetails = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const [movieData, reviewsData] = await Promise.all([
          getMovieDetails(id),
          getMovieReviews(id)
        ])
        setMovie(movieData)
        setReviews(reviewsData)
      } catch (err) {
        setError('Не удалось загрузить информацию о фильме')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (loading) {
    return <div className="loading">Загрузка фильма...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!movie) {
    return <div className="error">Фильм не найден</div>
  }

  return (
    <div className="movie-details">
      <div className="movie-hero">
        <img
          src={movie.thumbnailUrl || '/placeholder.jpg'}
          alt={movie.title}
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>⭐ {movie.rating || 'N/A'}</span>
              <span>📅 {movie.year}</span>
              <span>⏱️ {movie.duration} мин</span>
              <span>🌍 {movie.country}</span>
            </div>
            <p className="movie-genre">🎭 {movie.genre}</p>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="movie-description">
          <h2>📖 Описание</h2>
          <p>{movie.description || 'Описание отсутствует'}</p>
        </div>

        <div className="movie-reviews">
          <h2>💬 Отзывы ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews">Отзывов пока нет</p>
          ) : (
            <div className="reviews-grid">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-rating">⭐ {review.rating}/10</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails