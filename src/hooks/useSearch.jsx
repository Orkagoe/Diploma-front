import { useState, useEffect } from 'react'
import { searchMovies } from '../utils/api'

export const useSearch = (query) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      setError(null)
      try {
        const movies = await searchMovies(query)
        setResults(movies)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return { results, loading, error }
}