import RatingStars from "./RatingStars";

export default function ReviewCard({ review, onReact, onEdit, isOwner }) {
  return (
    <div
      style={{
        border: "1px solid #2a2f3a",
        borderRadius: 12,
        padding: 12,
        background: "#0f1115",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <strong>{review.author?.username || "User"}</strong>
          <span style={{ color: "#8a8f98", fontSize: 12 }}>
            {new Date(review.createdAt).toLocaleString()}
          </span>
          {review.isEdited && (
            <span style={{ color: "#8a8f98", fontSize: 12 }}>(изменено)</span>
          )}
        </div>
        <RatingStars value={(review.rating || 0) / 2} readOnly size={18} />
      </div>
      {review.text && (
        <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{review.text}</p>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
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
