import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addMovieFromImdb } from '../utils/api'
import '../styles/pages/AddMovie.css'

const AddMovie = () => {
  const [imdbId, setImdbId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const movie = await addMovieFromImdb(imdbId)
      setMessage(`✅ Фильм "${movie.title}" успешно добавлен!`)
      setImdbId('')
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-movie">
      <div className="add-movie-container">
        <h1>🎬 Добавить фильм</h1>
        <p>Введите IMDb ID для добавления фильма (например: tt0133093)</p>
        
        <form onSubmit={handleSubmit} className="add-movie-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="IMDb ID"
              value={imdbId}
              onChange={(e) => setImdbId(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Добавление...' : 'Добавить фильм'}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="help-info">
          <h3>ℹ️ Как найти IMDb ID?</h3>
          <ul>
            <li>Перейдите на сайт imdb.com</li>
            <li>Найдите нужный фильм</li>
            <li>Скопируйте ID из URL (например: tt0111161 для "Побег из Шоушенка")</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AddMovie