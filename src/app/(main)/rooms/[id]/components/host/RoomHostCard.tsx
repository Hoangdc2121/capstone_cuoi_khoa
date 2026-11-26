"use client";

import { BadgeCheck, MessageCircle, Star } from "lucide-react";

import AppButton from "@/components/common/AppButton";
import Reveal from "@/components/common/Reveal";
import {
  getRoomHostInfo,
  host,
  hostFacts,
  type RoomHostCardProps,
} from "@/features/rooms/data/roomHostCard";
import getRoomReviewSummary from "@/features/rooms/utils/getRoomReviewSummary";
import useScrollReveal from "@/hooks/useScrollReveal";

const revealOptions = {
  threshold: 0,
  rootMargin: "0px 0px -80px 0px",
};

export default function RoomHostCard({
  description,
  comments,
}: RoomHostCardProps) {
  const { ref: profileRef, visible: profileVisible } =
    useScrollReveal<HTMLDivElement>(revealOptions);

  const { ref: contactRef, visible: contactVisible } =
    useScrollReveal<HTMLDivElement>(revealOptions);

  const { extractedHostName, hostName, hostInitials } =
    getRoomHostInfo(description);

  const { reviewCount, ratingCount, averageRating } =
    getRoomReviewSummary(comments);

  const formattedRating =
    ratingCount > 0
      ? averageRating.toLocaleString("vi-VN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "—";

  return (
    <section
      aria-labelledby="room-host-title"
      className="mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="room-host-title"
          className="m-0! font-heading text-xl! font-semibold! text-foreground! sm:text-2xl!"
        >
          Gặp gỡ chủ nhà của bạn
        </h2>
      </div>

      <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 xl:gap-16">
        <div ref={profileRef} className="w-full min-w-0">
          <Reveal animation="right" visible={profileVisible} duration={0.7}>
            <div className="grid max-w-md grid-cols-[minmax(0,1fr)_100px] items-center gap-4 rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-lg shadow-foreground/5 sm:p-6">
              <div className="min-w-0 text-center">
                <div className="relative mx-auto w-fit">
                  <div className="flex size-24 items-center justify-center rounded-full bg-accent font-heading text-3xl font-semibold text-accent-foreground">
                    {hostInitials}
                  </div>

                  {extractedHostName && (
                    <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                      <BadgeCheck size={19} aria-hidden="true" />
                    </span>
                  )}
                </div>

                <h3 className="mb-0! mt-4! text-xl! font-semibold! text-card-foreground!">
                  {hostName}
                </h3>

                {extractedHostName && (
                  <p className="mb-0! mt-1! inline-flex items-center justify-center gap-1 text-xs! text-muted-foreground!">
                    <BadgeCheck size={13} aria-hidden="true" />
                    Chủ nhà siêu cấp
                  </p>
                )}
              </div>

              <dl className="m-0! divide-y divide-border">
                <div className="pb-3">
                  <dt className="text-xs text-muted-foreground">Đánh giá</dt>
                  <dd className="m-0! mt-0.5! text-xl font-semibold">
                    {reviewCount}
                  </dd>
                </div>

                <div className="py-3">
                  <dt className="text-xs text-muted-foreground">Xếp hạng</dt>
                  <dd className="m-0! mt-0.5! flex items-center gap-1 text-xl font-semibold">
                    {formattedRating}
                    <Star
                      size={14}
                      aria-hidden="true"
                      className="fill-primary text-primary"
                    />
                  </dd>
                </div>

                <div className="pt-3">
                  <dt className="text-xs leading-4 text-muted-foreground">
                    Năm đón khách
                  </dt>
                  <dd className="m-0! mt-0.5! text-xl font-semibold">
                    {host.yearsHosting}
                  </dd>
                </div>
              </dl>
            </div>

            <ul className="m-0! mt-6! list-none space-y-4 p-0!">
              {hostFacts.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <Icon
                    size={19}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-foreground"
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <p className="mb-0! mt-6! whitespace-pre-line text-sm! leading-7! text-muted-foreground!">
              {extractedHostName
                ? `Xin chào, mình là ${extractedHostName}! `
                : "Xin chào! "}
              {host.introduction}
            </p>
          </Reveal>
        </div>

        <div ref={contactRef} className="min-w-0 lg:pt-1">
          <Reveal animation="left" visible={contactVisible} duration={0.7}>
            <div className="max-w-xl">
              <h3 className="m-0! font-heading text-lg! font-semibold! text-foreground!">
                {extractedHostName
                  ? `${extractedHostName} là Chủ nhà siêu cấp`
                  : "Giới thiệu chủ nhà"}
              </h3>

              <p className="mb-0! mt-3! text-sm! leading-7! text-muted-foreground!">
                Một người yêu những chuyến đi và luôn mong muốn mang đến không
                gian nghỉ ngơi thoải mái. Sự chu đáo, giao tiếp rõ ràng và những
                gợi ý địa phương là điều {extractedHostName || "chủ nhà"} muốn
                chia sẻ trong mỗi kỳ lưu trú.
              </p>

              <div className="mt-7">
                <h3 className="m-0! font-heading text-lg! font-semibold! text-foreground!">
                  Thông tin chủ nhà
                </h3>

                <dl className="m-0! mt-4! space-y-3 text-sm">
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <dt className="text-muted-foreground">Tỷ lệ phản hồi:</dt>
                    <dd className="m-0! font-medium text-foreground">
                      {host.responseRate}
                    </dd>
                  </div>

                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <dt className="text-muted-foreground">
                      Thời gian phản hồi:
                    </dt>
                    <dd className="m-0! font-medium text-foreground">
                      {host.responseTime}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-7">
                <h3 className="m-0! font-heading text-lg! font-semibold! text-foreground!">
                  Bạn có thể hỏi chủ nhà
                </h3>

                <ul className="m-0! mt-3! list-disc space-y-2 pl-5! text-sm leading-6 text-muted-foreground">
                  <li>Cách di chuyển đến chỗ ở và khu vực xung quanh.</li>
                  <li>Tiện nghi phù hợp với nhu cầu của nhóm bạn.</li>
                  <li>Gợi ý quán ăn, cà phê và địa điểm tham quan.</li>
                </ul>
              </div>

              <AppButton
                type="default"
                htmlType="button"
                disabled
                className="mt-6! inline-flex! h-11! items-center! gap-2! rounded-xl! px-5!"
              >
                <MessageCircle size={17} aria-hidden="true" />
                <span>Nhắn tin cho chủ nhà</span>
              </AppButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
