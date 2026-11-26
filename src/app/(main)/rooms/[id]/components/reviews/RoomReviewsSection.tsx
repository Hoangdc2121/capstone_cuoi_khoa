"use client";

import AppButton from "@/components/common/AppButton";
import type useRoomReviewsSection from "@/features/rooms/hooks/useRoomReviewsSection";
import RoomReviews from "./RoomReviews";
import RoomReviewSummary from "./RoomReviewSummary";
import RoomHostCard from "../host/RoomHostCard";

type RoomReviewsSectionProps = {
  description?: string | null;
  reviews: ReturnType<typeof useRoomReviewsSection>;
};

export default function RoomReviewsSection({
  description,
  reviews,
}: RoomReviewsSectionProps) {
  const {
    ref,
    comments,
    sortedComments,
    loading,
    error,
    retry,
    showReviews,
    handleSubmitReview,
  } = reviews;

  // Giữ phần return hiện tại ở đây, kể cả div có ref={ref}.

  return (
    <>
      <div ref={ref} className="min-h-48">
        {error && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-5">
            <p
              role="alert"
              className="m-0! text-sm! leading-6! text-destructive!"
            >
              {error}
            </p>

            <AppButton htmlType="button" onClick={retry} className="mt-4!">
              Thử lại
            </AppButton>
          </div>
        )}

        {showReviews ? (
          <>
            {loading && (
              <p
                role="status"
                className="mb-0! mt-4! text-sm! text-muted-foreground!"
              >
                Đang cập nhật bình luận…
              </p>
            )}

            <RoomReviewSummary comments={comments} />

            <RoomReviews
              comments={sortedComments}
              onSubmitReview={handleSubmitReview}
            />
          </>
        ) : !error ? (
          <div
            role="status"
            aria-busy={loading}
            className="py-12 text-center text-sm text-muted-foreground"
          >
            {loading
              ? "Đang tải bình luận và đánh giá…"
              : "Bình luận và đánh giá"}
          </div>
        ) : null}
      </div>

      <RoomHostCard description={description} comments={comments} />
    </>
  );
}
