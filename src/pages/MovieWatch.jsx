import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import http from "../shared/api/http";

import PlayerPlaceholder from "../components/PlayerPlaceholder";
import RatingStars from "../components/RatingStars";
import ReviewCard from "../components/ReviewCard";
import ReviewFormModal from "../components/ReviewFormModal";
import CommentsSection from "../components/Comments/CommentsSection";
import RecommendationsRail from "../components/RightRail/RecommendationsRail";

import "../styles/pages/MovieWatch.css";

import {
  usePreviewReviews,
  useCreateOrUpdateReview,
  useReactReview,
} from "../hooks/useReviews";

export default function MovieWatch() {
  const { imdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // теперь под твой реальный backend URL
  useEffect(() => {
    http
      .get(`/api/movies/imdb/${imdbId}`)
      .then((r) => setMovie(r.data))
      .catch(() => setMovie(null));
  }, [imdbId]);

  const { data: reviewsPreview } = usePreviewReviews(imdbId, 5);
  const reactReview = useReactReview(imdbId);
  const { create, update } = useCreateOrUpdateReview(imdbId);

  const userReview = useMemo(
    () => reviewsPreview?.items?.find((r) => r.isOwner),
    [reviewsPreview]
  );

  const submitReview = (payload) => {
    const action = editing
      ? update.mutateAsync({ id: editing.id, payload })
      : create.mutateAsync({ imdbId, ...payload });
    action.finally(() => {
      setModalOpen(false);
      setEditing(null);
    });
  };

  return (
    <div className="watch">
      <div className="watch-grid">
        {/* Левая колонка */}
        <div>
          <PlayerPlaceholder />

          <h1 className="h1">{movie?.title || "Фильм"}</h1>
          <p className="muted">
            {movie?.plot
              ? movie.plot.length > 320
                ? movie.plot.slice(0, 320) + "…"
                : movie.plot
              : "Описание появится позже"}
          </p>

          <div className="card rating-box">
            <div className="rating-left">
              {userReview ? (
                <>
                  <div>
                    <div className="comment-meta">Ваша оценка</div>
                    <RatingStars
                      value={(userReview.rating || 0) / 2}
                      readOnly
                    />
                  </div>
                  <button
                    className="btn"
                    onClick={() => {
                      setEditing(userReview);
                      setModalOpen(true);
                    }}
                  >
                    Изменить
                  </button>
                </>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    setEditing(null);
                    setModalOpen(true);
                  }}
                >
                  Оценить и написать отзыв
                </button>
              )}
              <Link to={`/movie/${imdbId}/reviews`} className="btn btn-ghost">
                Читать отзывы
              </Link>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">Последние отзывы</h3>
            <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
              {reviewsPreview?.items?.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  isOwner={r.isOwner}
                  onReact={(id, reaction) =>
                    reactReview.mutate({ id, reaction })
                  }
                  onEdit={(r) => {
                    setEditing(r);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="section card">
            <h3 className="section-title" style={{ margin: 0 }}>
              Комментарии
            </h3>
            <CommentsSection imdbId={imdbId} />
          </div>
        </div>

        {/* Правая колонка */}
        <div>
          <RecommendationsRail imdbId={imdbId} />
        </div>
      </div>

      <ReviewFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={submitReview}
      />
    </div>
  );
}
