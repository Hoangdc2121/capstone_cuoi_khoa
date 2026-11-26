import type { RoomCommentType } from "../types/comment.types";

export default function getRoomReviewSummary(
  comments: RoomCommentType[],
) {
  // Chỉ tính điểm từ số sao nguyên, hợp lệ trong khoảng 1–5.
  const ratedComments = comments.filter(
    (comment) =>
      Number.isInteger(comment.saoBinhLuan) &&
      comment.saoBinhLuan >= 1 &&
      comment.saoBinhLuan <= 5,
  );

  const reviewCount = comments.length;
  const ratingCount = ratedComments.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratedComments.filter(
      (comment) => comment.saoBinhLuan === stars,
    ).length,
  }));

  const averageRating =
    ratingCount > 0
      ? ratedComments.reduce(
          (sum, comment) => sum + comment.saoBinhLuan,
          0,
        ) / ratingCount
      : 0;

  return {
    reviewCount,
    ratingCount,
    averageRating,
    ratingDistribution,
  };
}