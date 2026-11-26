"use client";

import { Star } from "lucide-react";

import type { RoomCommentType } from "@/features/rooms/types/comment.types";
import useRoomReviewItem from "@/features/rooms/hooks/useRoomReviewItem";
import formatReviewDate from "@/features/rooms/utils/formatReviewDate";

type RoomReviewItemProps = {
  review: RoomCommentType;
};

export default function RoomReviewItem({ review }: RoomReviewItemProps) {
  const {
    contentId,
    contentRef,
    expanded,
    canExpand,
    name,
    avatar,
    content,
    initials,
    validRating,
    showAvatar,
    handleAvatarError,
    toggleExpanded,
  } = useRoomReviewItem(review);

  // Kiểm tra nội dung có vượt quá 3 dòng không.

  return (
    <article className="min-w-0">
      {/* Người bình luận. */}
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-semibold text-accent-foreground"
        >
          {showAvatar ? (
            <img
              src={avatar}
              alt=""
              loading="lazy"
              decoding="async"
              onError={handleAvatarError}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <h3 className="m-0! min-w-0 truncate text-sm! font-semibold! text-foreground!">
          {name}
        </h3>
      </div>

      {/* Điểm sao. */}
      {validRating && (
        <div className="mt-3">
          <span
            role="img"
            aria-label={`${review.saoBinhLuan} trên 5 sao`}
            className="inline-flex items-center gap-0.5"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={12}
                aria-hidden="true"
                className={
                  index < review.saoBinhLuan
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/40"
                }
              />
            ))}
          </span>
        </div>
      )}

      {/* Nội dung bình luận. */}
      <p
        ref={contentRef}
        id={contentId}
        className={[
          "mb-0! mt-2! whitespace-pre-line text-sm! leading-7! text-muted-foreground! wrap-break-word",
          expanded ? "" : "line-clamp-3",
        ].join(" ")}
      >
        {content || "Không có nội dung bình luận."}
      </p>

      {/* Thời gian bình luận. */}
      <span className="mt-2 block text-xs text-muted-foreground">
        {formatReviewDate(review.ngayBinhLuan)}
      </span>

      {/* Chỉ hiện khi nội dung dài hơn 3 dòng. */}
      {canExpand && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={toggleExpanded}
          className="group mt-2 inline-flex cursor-pointer items-center rounded-sm text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="animated-underline group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
            {expanded ? "Thu gọn" : "Hiển thị thêm"}
          </span>
        </button>
      )}
    </article>
  );
}
