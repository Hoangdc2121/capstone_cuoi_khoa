"use client";

import { Statistic } from "antd";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import CountUp from "react-countup";

import { categories } from "@/features/rooms/data/roomReviewSummary";
import type { RoomCommentType } from "@/features/rooms/types/comment.types";
import getRoomReviewSummary from "@/features/rooms/utils/getRoomReviewSummary";

type RoomReviewSummaryProps = {
  comments: RoomCommentType[];
};

export default function RoomReviewSummary({
  comments,
}: RoomReviewSummaryProps) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const scoreVisible = useInView(scoreRef, { amount: 0.65, once: true });
  const reduceMotion = useReducedMotion();

  const { reviewCount, ratingCount, averageRating, ratingDistribution } =
    getRoomReviewSummary(comments);

  const hasRating = ratingCount > 0;
  const formattedRating = averageRating.toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section
      id="room-reviews"
      aria-labelledby="room-reviews-title"
      className="mt-12 scroll-mt-28 border-t border-border py-10 sm:mt-16 sm:py-14"
    >
      {/* Điểm đánh giá tổng. */}
      <div className="mx-auto max-w-xl text-center">
        <div
          ref={scoreRef}
          className="mt-5 flex items-center justify-center gap-2 sm:gap-4"
        >
          <img
            src="/img/rating_right.png"
            alt=""
            draggable={false}
            className="h-24 w-14 shrink-0 select-none object-contain sm:h-32 sm:w-20"
          />

          <div className="font-heading text-7xl font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-8xl">
            <span className="sr-only">
              {hasRating
                ? `${formattedRating} trên 5 sao`
                : "Chưa có điểm đánh giá"}
            </span>

            <div aria-hidden="true">
              {hasRating ? (
                <Statistic
                  value={reduceMotion || scoreVisible ? averageRating : 0}
                  precision={2}
                  decimalSeparator=","
                  style={{ font: "inherit", color: "inherit" }}
                  styles={{
                    content: {
                      font: "inherit",
                      color: "inherit",
                    },
                  }}
                  formatter={
                    scoreVisible
                      ? () => (
                          <CountUp
                            start={0}
                            end={averageRating}
                            duration={1.2}
                            decimals={2}
                            decimal=","
                          />
                        )
                      : undefined
                  }
                />
              ) : (
                "—"
              )}
            </div>
          </div>

          <img
            src="/img/rating_left.png"
            alt=""
            draggable={false}
            className="h-24 w-14 shrink-0 select-none object-contain sm:h-32 sm:w-20"
          />
        </div>

        <h2
          id="room-reviews-title"
          className="mb-0! mt-5! font-heading text-xl! font-semibold! text-foreground! sm:text-2xl!"
        >
          Đánh giá từ khách
        </h2>

        <p className="mb-0! mt-3! text-sm! leading-6! text-muted-foreground!">
          Cảm nhận về chỗ ở qua trải nghiệm lưu trú, tiện nghi và khu vực xung
          quanh.
        </p>

        <p className="mb-0! mt-2! text-sm! font-medium! text-foreground!">
          {reviewCount} lượt đánh giá
        </p>
      </div>

      {/* Phân bố sao và các tiêu chí đánh giá. */}
      <div className="mx-auto mt-10 grid w-full max-w-6xl grid-cols-2 gap-y-7 sm:grid-cols-3 lg:mt-12 lg:grid-cols-[1.2fr_repeat(6,minmax(0,1fr))] lg:gap-y-0">
        <div className="col-span-2 min-w-0 pb-2 sm:col-span-3 lg:col-span-1 lg:pr-5">
          <div className="mx-auto w-full max-w-xs">
            <h3 className="m-0! text-sm! font-medium! text-foreground!">
              Xếp hạng tổng thể
            </h3>

            <ul className="m-0! mt-3! list-none space-y-1.5 p-0!">
              {ratingDistribution.map(({ stars, count }) => {
                const percentage = hasRating ? (count / ratingCount) * 100 : 0;

                return (
                  <li
                    key={stars}
                    aria-label={`${stars} sao: ${count} lượt đánh giá`}
                    className="flex items-center gap-2"
                  >
                    <span
                      aria-hidden="true"
                      className="w-2 shrink-0 text-xs text-muted-foreground"
                    >
                      {stars}
                    </span>

                    <div
                      aria-hidden="true"
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Các tiêu chí hiện vẫn dùng dữ liệu mẫu. */}
        {categories.map(({ label, score, icon: Icon }, index) => (
          <div
            key={label}
            className={[
              "flex min-w-0 flex-col items-center px-3 text-center",
              "border-border",
              index % 2 === 1 ? "border-l" : "border-l-0",
              index % 3 === 0 ? "sm:border-l-0" : "sm:border-l",
              "lg:border-l",
            ].join(" ")}
          >
            <h3 className="m-0! flex min-h-10 items-center justify-center text-sm! font-medium! leading-5! text-foreground!">
              {label}
            </h3>

            <span className="mt-1 text-base font-semibold text-foreground">
              {score.toLocaleString("vi-VN", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>

            <Icon
              size={25}
              strokeWidth={1.6}
              aria-hidden="true"
              className="mt-5 shrink-0 text-primary"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
