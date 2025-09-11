import { useState, useEffect } from 'react'
import { getMovies } from '../utils/api'

export const useMovies = (type, genre) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const allMovies = await getMovies()
        
        let filtered = allMovies
        if (type) {
          const normalizedType = type === 'movies' ? 'movie' : 'anime'
          filtered = filtered.filter(movie =>
            movie.type && movie.type.toLowerCase() === normalizedType
          )
        }
        
        if (genre) {
          filtered = filtered.filter(movie =>
            movie.genre && movie.genre.toLowerCase().includes(genre.toLowerCase())
          )
        }
        
        setMovies(filtered)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [type, genre])

  return { movies, loading, error }
}