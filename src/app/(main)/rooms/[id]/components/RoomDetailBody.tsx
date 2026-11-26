"use client";

import { useEffect, useId, useRef, useState } from "react";

import AppButton from "@/components/common/AppButton";
import Reveal from "@/components/common/Reveal";
import useRoomReviewsSection from "@/features/rooms/hooks/useRoomReviewsSection";
import type { RoomType } from "@/features/rooms/types/room.types";
import getRoomReviewSummary from "@/features/rooms/utils/getRoomReviewSummary";
import useScrollReveal from "@/hooks/useScrollReveal";

import RoomDetailTabs, { type RoomDetailTab } from "./RoomDetailTabs";
import RoomAmenities from "./amenities/RoomAmenities";
import RoomBookingCard from "./booking/RoomBookingCard";
import RoomOverview from "./overview/RoomOverview";
import RoomThingsToKnow from "./policies/RoomThingsToKnow";
import RoomReviewsSection from "./reviews/RoomReviewsSection";

type RoomDetailBodyProps = {
  room: RoomType;
};

export default function RoomDetailBody({ room }: RoomDetailBodyProps) {
  const contentId = useId();
  const bookingId = `${contentId}-booking`;
  const bookingTargetRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<RoomDetailTab>("overview");
  const [showMobileBookingBar, setShowMobileBookingBar] = useState(false);

  const { ref: overviewRef, visible: overviewVisible } = useScrollReveal({
    threshold: 0,
    rootMargin: "0px 0px -40px 0px",
  });

  const { ref: bookingRef, visible: bookingVisible } =
    useScrollReveal<HTMLElement>({
      threshold: 0,
      rootMargin: "0px 0px -40px 0px",
    });

  const reviews = useRoomReviewsSection(room.id);

  const reviewStats =
    reviews.showReviews && !reviews.loading && !reviews.error
      ? getRoomReviewSummary(reviews.comments)
      : undefined;

  useEffect(() => {
    const target = bookingTargetRef.current;
    if (!target) return;

    const updateBookingBar = () => {
      setShowMobileBookingBar(target.getBoundingClientRect().bottom <= 0);
    };

    updateBookingBar();

    window.addEventListener("scroll", updateBookingBar, { passive: true });
    window.addEventListener("resize", updateBookingBar);

    return () => {
      window.removeEventListener("scroll", updateBookingBar);
      window.removeEventListener("resize", updateBookingBar);
    };
  }, [activeTab, room.id]);

  const handleChooseDates = () => {
    const target = datePickerRef.current;
    if (!target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.focus({ preventScroll: true });
    target.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  return (
    <article className="mt-6">
      <div className="mt-7 grid min-w-0 gap-8 sm:mt-9 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:items-start xl:gap-10">
        <div ref={overviewRef} className="min-w-0">
          <Reveal animation="right" visible={overviewVisible} duration={0.7}>
            <RoomDetailTabs
              activeTab={activeTab}
              contentId={contentId}
              onChange={setActiveTab}
            />

            <div id={`${contentId}-overview`} hidden={activeTab !== "overview"}>
              <RoomOverview room={room} />
            </div>

            <div
              id={`${contentId}-amenities`}
              hidden={activeTab !== "amenities"}
            >
              <RoomAmenities room={room} />
            </div>

            <div
              id={`${contentId}-policies`}
              hidden={activeTab !== "policies"}
              className="[&>section]:mt-0! [&>section]:border-t-0! [&>section]:pb-0! [&>section]:pt-0!"
            >
              <RoomThingsToKnow />
            </div>
          </Reveal>
        </div>

        <aside
          ref={bookingRef}
          aria-label="Thông tin đặt phòng"
          className="min-w-0 xl:sticky xl:top-28"
        >
          <div id={bookingId} ref={bookingTargetRef}>
            <Reveal
              animation="left"
              visible={bookingVisible}
              duration={0.7}
              delay={0.1}
            >
              <RoomBookingCard
                roomId={room.id}
                roomName={room.tenPhong}
                price={room.giaTien}
                maxGuests={room.khach}
                reviewStats={reviewStats}
                datePickerRef={datePickerRef}
              />
            </Reveal>
          </div>
        </aside>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <RoomReviewsSection description={room.moTa} reviews={reviews} />
      </div>

      {showMobileBookingBar && (
        <div className="fixed inset-x-0 bottom-[calc(var(--mobile-nav-height,64px)+env(safe-area-inset-bottom,0px))] z-40 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <p className="m-0! min-w-0 text-sm! text-foreground!">
            <span className="text-base font-semibold">
              {room.giaTien.toLocaleString("vi-VN")} USD
            </span>{" "}
            <span className="text-muted-foreground">/ đêm</span>
          </p>

          <AppButton
            type="primary"
            htmlType="button"
            aria-controls={bookingId}
            onClick={handleChooseDates}
            className="h-11! shrink-0 rounded-xl! px-5!"
          >
            Chọn ngày
          </AppButton>
        </div>
      )}
    </article>
  );
}
