import React from 'react';
import { useProducts } from '../hooks/useMerchProducts';
import { useAuth } from '../hooks/useAuth';

export default function MerchPage() {
  const { user } = useAuth();
  const username = user?.username;
  const { data: products, isLoading, createOrder } = useProducts();

  const buy = async (productId) => {
    if (!username) { alert('Войдите, чтобы купить'); return; }
    try {
      await createOrder({ username, productId, qty: 1 });
      alert('Заказ создан');
    } catch (e) {
      alert('Ошибка покупки: ' + e.message);
    }
  };

  if (isLoading) return <p>Загрузка...</p>;
  return (
    <div className="container merch-page">
      <h1>Мерч</h1>
      <div className="products-grid">
        {products?.map(p => (
          <div key={p.id} className="product-card">
            <img src={p.imageUrl || '/placeholder.jpg'} alt={p.title} />
            <h3>{p.title}</h3>
            <p>{(p.priceCents/100).toFixed(2)} {p.currency}</p>
            <p>В наличии: {p.stock}</p>
            <button onClick={() => buy(p.id)} disabled={p.stock<=0}>Купить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
