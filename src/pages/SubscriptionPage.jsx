import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const username = user?.username;
  const { data: sub, isLoading, subscribe, cancel } = useSubscription(username);

  if (!username) return <p>Войдите для управления подпиской</p>;
  if (isLoading) return <p>Загрузка...</p>;

  const onSubscribe = async () => {
    try {
      await subscribe({ plan: 'pro' });
      alert('Оформлено');
    } catch (e) { alert('Ошибка: ' + e.message); }
  };

  const onCancel = async () => {
    try {
      await cancel();
      alert('Подписка отменена');
    } catch (e) { alert('Ошибка'); }
  };

  return (
    <div className="container subscription-page">
      <h1>Подписка</h1>
      <p>Текущий план: {sub?.plan || 'free'}</p>
      <p>Статус: {sub?.status || 'none'}</p>
      {sub?.status === 'active' ? (
        <button onClick={onCancel}>Отменить подписку</button>
      ) : (
        <button onClick={onSubscribe}>Оформить PRO</button>
      )}
    </div>
  );
}
