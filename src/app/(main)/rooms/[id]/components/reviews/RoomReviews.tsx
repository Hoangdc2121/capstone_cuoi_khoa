"use client";

import AppButton from "@/components/common/AppButton";
import Reveal from "@/components/common/Reveal";
import useRoomReviews from "@/features/rooms/hooks/useRoomReviews";
import type { RoomCommentType } from "@/features/rooms/types/comment.types";
import useScrollReveal from "@/hooks/useScrollReveal";

import RoomReviewForm, { type RoomReviewFormValues } from "./RoomReviewForm";
import RoomReviewItem from "./RoomReviewItem";
import RoomReviewsModal from "./RoomReviewsModal";

const mobileVisibleClass = "max-sm:opacity-100! max-sm:transform-none!";

type RoomReviewsProps = {
  comments: RoomCommentType[];
  onSubmitReview: (values: RoomReviewFormValues) => Promise<void>;
};

function RoomReviewGrid({ comments }: { comments: RoomCommentType[] }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({
    threshold: 0,
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <div
      ref={ref}
      className="mt-7 grid min-w-0 grid-cols-1 gap-y-9 overflow-x-clip sm:grid-cols-2 sm:gap-x-10 lg:gap-x-16"
    >
      {comments.map((review, index) => (
        <Reveal
          key={review.id}
          className={`min-w-0 ${mobileVisibleClass}`}
          animation={index % 2 === 0 ? "right" : "left"}
          visible={visible}
          duration={0.7}
        >
          <RoomReviewItem review={review} />
        </Reveal>
      ))}
    </div>
  );
}

export default function RoomReviews({
  comments,
  onSubmitReview,
}: RoomReviewsProps) {
  const {
    ref: formRef,
    visible: formVisible,
    titleId,
    reviewCount,
    previewComments,
    hasComments,
    hasMoreComments,
    allReviewsOpen,
    openAllReviews,
    closeAllReviews,
  } = useRoomReviews(comments);

  return (
    <section
      aria-labelledby={titleId}
      className="border-t border-border py-8 sm:py-10"
    >
      <h2
        id={titleId}
        className="m-0! font-heading text-xl! font-semibold! text-foreground! sm:text-2xl!"
      >
        Chia sẻ từ khách lưu trú
      </h2>

      {hasComments ? (
        <>
          <RoomReviewGrid comments={previewComments} />

          {hasMoreComments && (
            <AppButton
              type="default"
              htmlType="button"
              onClick={openAllReviews}
              className="mt-8! h-11! rounded-xl! border-border! bg-transparent! px-5! font-medium! text-foreground! transition-colors! duration-200! hover:border-primary! hover:bg-accent!"
            >
              Hiển thị tất cả {reviewCount} bình luận
            </AppButton>
          )}
        </>
      ) : (
        <p className="mb-0! mt-5! text-sm! leading-6! text-muted-foreground!">
          Chưa có bình luận cho chỗ ở này.
        </p>
      )}

      <section
        ref={formRef}
        className="mt-8 border-t border-border pt-8 sm:mt-10 sm:pt-10"
      >
        <Reveal
          animation="up"
          visible={formVisible}
          duration={0.7}
          className={mobileVisibleClass}
        >
          <RoomReviewForm onSubmit={onSubmitReview} />
        </Reveal>
      </section>

      <RoomReviewsModal
        open={allReviewsOpen}
        comments={comments}
        onClose={closeAllReviews}
      />
    </section>
  );
}
