// src/components/ReviewCard.jsx

import RatingStars from "./RatingStars";

export default function ReviewCard({ review, isOwner, onReact, onEdit }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{review.author?.username || "User"}</strong>
        <span className="review-date">
          {new Date(review.createdAt).toLocaleString()}
        </span>

        {/* МЕСТО ДЛЯ ЗВЕЗД */}
        <RatingStars value={review.rating / 2} readOnly />
      </div>

      {/* ТЕКСТ ОТЗЫВА */}
      <p className="review-body">{review.body}</p>

      <div className="review-actions">
        <button onClick={() => onReact?.(review.id, "like")}>
          👍 {review.likes || 0}
        </button>
        <button onClick={() => onReact?.(review.id, "dislike")}>
          👎 {review.dislikes || 0}
        </button>

        {isOwner && (
          <button onClick={() => onEdit?.(review)}>Редактировать</button>
        )}
      </div>
    </div>
  );
}
