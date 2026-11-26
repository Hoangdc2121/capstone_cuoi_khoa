"use client";

import { useId } from "react";
import { Send, Star } from "lucide-react";

import AppButton from "@/components/common/AppButton";
import useRoomReviewForm, {
  type RoomReviewFormValues,
} from "@/features/rooms/hooks/useRoomReviewForm";
import { Input } from "antd";

// Giữ các import type hiện tại từ component này hoạt động.
export type { RoomReviewFormValues } from "@/features/rooms/hooks/useRoomReviewForm";

const ratingLabels = [
  "Chọn số sao",
  "Rất không hài lòng",
  "Không hài lòng",
  "Bình thường",
  "Hài lòng",
  "Rất hài lòng",
];

type RoomReviewFormProps = {
  onSubmit: (values: RoomReviewFormValues) => Promise<void>;
};

export default function RoomReviewForm({ onSubmit }: RoomReviewFormProps) {
  const id = useId();

  const {
    rating,
    content,
    submitting,
    errors,
    handleRatingChange,
    handleContentChange,
    handleSubmit,
  } = useRoomReviewForm(onSubmit);

  return (
    <section aria-labelledby={`${id}-title`}>
      <h2
        id={`${id}-title`}
        className="m-0! font-heading text-xl! font-semibold! text-foreground! sm:text-2xl!"
      >
        Chia sẻ trải nghiệm của bạn
      </h2>

      <form
        onSubmit={handleSubmit}
        aria-busy={submitting}
        noValidate
        className="mt-6"
      >
        {/* Chọn số sao. */}
        <fieldset
          disabled={submitting}
          aria-describedby={errors.rating ? `${id}-rating-error` : undefined}
          className="m-0 min-w-0 border-0 p-0"
        >
          <legend className="sr-only">Đánh giá chỗ ở từ 1 đến 5 sao</legend>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className={[
                    "relative flex size-10 items-center justify-center rounded-lg",
                    submitting
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={`${id}-rating`}
                    value={value}
                    checked={rating === value}
                    aria-invalid={Boolean(errors.rating)}
                    onChange={() => handleRatingChange(value)}
                    className="peer sr-only"
                  />

                  <span className="group flex size-10 items-center justify-center rounded-lg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                    <Star
                      size={28}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className={[
                        "transition-colors duration-200",
                        value <= rating
                          ? "fill-primary text-primary"
                          : "fill-transparent text-muted-foreground/50",
                        submitting ? "" : "group-hover:text-primary",
                      ].join(" ")}
                    />
                  </span>

                  <span className="sr-only">
                    {value} sao — {ratingLabels[value]}
                  </span>
                </label>
              ))}
            </div>

            <span aria-live="polite" className="text-sm text-muted-foreground">
              {ratingLabels[rating]}
            </span>
          </div>

          {errors.rating && (
            <p
              id={`${id}-rating-error`}
              role="alert"
              className="mb-0! mt-2! text-sm! leading-6! text-destructive!"
            >
              {errors.rating}
            </p>
          )}
        </fieldset>

        {/* Nội dung bình luận. */}
        <div className="mt-5">
          <label
            htmlFor={`${id}-content`}
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Bình luận của bạn
          </label>

          <Input.TextArea
            id={`${id}-content`}
            name="noiDung"
            value={content}
            onChange={(event) => handleContentChange(event.target.value)}
            disabled={submitting}
            placeholder="Chia sẻ cảm nhận về không gian, tiện nghi và trải nghiệm lưu trú của bạn…"
            autoSize={{ minRows: 5, maxRows: 10 }}
            maxLength={2000}
            status={errors.content ? "error" : undefined}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={[
              `${id}-count`,
              errors.content ? `${id}-content-error` : "",
            ]
              .filter(Boolean)
              .join(" ")}
            className={[
              "block! w-full! rounded-2xl! border! bg-background! px-4! py-3! text-sm! leading-7! text-foreground!",
              "placeholder:text-muted-foreground/70!",
              "disabled:cursor-not-allowed! disabled:opacity-60!",
              errors.content
                ? "border-destructive! hover:border-destructive! focus:border-destructive! focus:shadow-none! focus:ring-2! focus:ring-destructive/20!"
                : "border-input! hover:border-primary! focus:border-primary! focus:shadow-none! focus:ring-2! focus:ring-primary/20!",
            ].join(" ")}
          />

          {errors.content && (
            <p
              id={`${id}-content-error`}
              role="alert"
              className="mb-0! mt-2! text-sm! leading-6! text-destructive!"
            >
              {errors.content}
            </p>
          )}

          <p
            id={`${id}-count`}
            className="mb-0! mt-2! text-right text-xs! text-muted-foreground!"
          >
            {content.length}/2000 ký tự
          </p>
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="m-0! text-xs! leading-5! text-muted-foreground!">
            Chia sẻ đánh giá dựa trên trải nghiệm lưu trú của bạn.
          </p>

          <AppButton
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
            className="inline-flex! h-11! w-full! shrink-0! items-center! justify-center! gap-2! rounded-xl! px-5! font-semibold! sm:w-auto!"
          >
            {!submitting && <Send size={16} aria-hidden="true" />}

            <span>{submitting ? "Đang gửi…" : "Gửi bình luận"}</span>
          </AppButton>
        </div>
      </form>
    </section>
  );
}
