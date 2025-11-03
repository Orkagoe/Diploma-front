import React, { useState, useEffect } from 'react';
import http from '../shared/api/http';

export default function AdminAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get('/api/admin/analytics/daily').then(r => {
      setData(r.data);
    }).catch(() => {
      setData([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;
  return (
    <div className="container analytics-admin">
      <h1>Аналитика (daily)</h1>
      <table>
        <thead>
          <tr><th>userId</th><th>date</th><th>plays</th><th>likes</th><th>shares</th></tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.userId}</td>
              <td>{d.d}</td>
              <td>{d.plays}</td>
              <td>{d.likes}</td>
              <td>{d.shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
