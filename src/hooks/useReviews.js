import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../shared/api/http";

// === API ===
export const previewReviews = async ({ imdbId, limit = 5 }) => {
  const { data } = await http.get(`/api/movies/${imdbId}/reviews?size=${limit}`);
  return { items: data.content || [] };
};

export const listReviews = async ({ imdbId, page = 0, size = 10 }) => {
  const { data } = await http.get(`/api/movies/${imdbId}/reviews?page=${page}&size=${size}`);
  return { items: data.content, hasMore: !data.last };
};

export const createReview = async ({ imdbId, rating, text }) => {
  const { data } = await http.post(`/api/movies/${imdbId}/reviews`, {
    rating,
    text,
  });
  return data;
};

export const updateReview = async (id, payload) => {
  const { data } = await http.put(`/api/reviews/${id}`, payload);
  return data;
};

export const reactReview = async (id, reaction) => {
  await http.post(`/api/reviews/${id}/reactions/${reaction}`);
};

// === HOOKS ===
export const usePreviewReviews = (imdbId, limit = 5) =>
  useQuery({
    queryKey: ["reviewsPreview", imdbId, limit],
    queryFn: () => previewReviews({ imdbId, limit }),
  });

export const usePagedReviews = (imdbId, page, size) =>
  useQuery({
    queryKey: ["reviews", imdbId, page, size],
    queryFn: () => listReviews({ imdbId, page, size }),
    keepPreviousData: true,
  });

export const useCreateOrUpdateReview = (imdbId) => {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["reviewsPreview", imdbId] });
    qc.invalidateQueries({ queryKey: ["reviews", imdbId] });
  };
  const create = useMutation({ mutationFn: createReview, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, payload }) => updateReview(id, payload),
    onSuccess: invalidate,
  });
  return { create, update };
};

export const useReactReview = (imdbId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reaction }) => reactReview(id, reaction),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews", imdbId] }),
  });
};
