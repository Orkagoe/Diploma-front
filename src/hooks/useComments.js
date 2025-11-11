import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listRootComments,
  createComment,
  updateComment,
  deleteComment,
  reactComment,
} from "../shared/api/comments";

// корневые комментарии
export const useRootComments = (imdbId, page = 0, size = 20, sort = "top") =>
  useQuery({
    queryKey: ["commentsRoot", imdbId, page, size, sort],
    queryFn: () => listRootComments({ imdbId, page, size, sort }),
    keepPreviousData: true,
  });

// временная заглушка для вложенных ответов, чтобы не падало
export const useReplies = () => ({ data: { items: [] }, isLoading: false });

export const useCommentMutations = (imdbId) => {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["commentsRoot", imdbId] });

  return {
    create: useMutation({
      mutationFn: ({ imdbId, text, parentId }) =>
        createComment({ imdbId, body: text, parentId }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }) => updateComment(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: deleteComment,
      onSuccess: invalidate,
    }),
    react: useMutation({
      mutationFn: ({ id, reaction }) => reactComment(id, reaction),
      onSuccess: invalidate,
    }),
  };
};
