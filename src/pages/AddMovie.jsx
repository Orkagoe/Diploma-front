// src/pages/AddMovie.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFromImdb } from '../shared/api/movies';

export default function AddMovie() {
  const [imdbId, setImdbId] = useState('');
  const [msg, setMsg] = useState('');
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => addFromImdb(id),
    onSuccess: (data) => {
      // v5: invalidate using object
      qc.invalidateQueries({ queryKey: ['movies'] });
      setMsg(`Фильм "${data?.title || data?.imdbId || id}" добавлен`);
    },
    onError: (err) => setMsg('Ошибка: ' + (err?.message || err)),
  });

  const submit = (e) => {
    e.preventDefault();
    const id = imdbId.trim();
    if (!/^tt\d{7,8}$/.test(id)) {
      setMsg('Неверный IMDb ID');
      return;
    }
    mutation.mutate(id);
    setImdbId('');
  };

  return (
    <div className="container">
      <h1>Добавить фильм по IMDb ID</h1>
      <form onSubmit={submit} className="imdb-import">
        <input
          className="input"
          value={imdbId}
          onChange={(e) => setImdbId(e.target.value)}
          placeholder="tt1234567"
        />
        <button className="button" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Импорт...' : 'Импортировать'}
        </button>
      </form>
      {msg && <p className="status-message">{msg}</p>}
    </div>
  );
}
