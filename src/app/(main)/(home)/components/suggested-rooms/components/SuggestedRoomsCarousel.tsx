"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import AppButton from "@/components/common/AppButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import RoomCard from "./RoomCard";
import useSuggestedRoomsCarousel from "../hooks/useSuggestedRoomsCarousel";

import type { DestinationType } from "../../../../../../features/destinations/types/destination.types";
import type { RoomType } from "@/features/rooms/types/room.types";

type SuggestedRoomsCarouselProps = {
  rooms: RoomType[];
  destinations: DestinationType[];
};

export default function SuggestedRoomsCarousel({
  rooms,
  destinations,
}: SuggestedRoomsCarouselProps) {
  const { api, setApi, canScrollPrev, canScrollNext, locations, current } =
    useSuggestedRoomsCarousel({
      destinations,
      itemCount: rooms.length,
    });

  const controlClassName =
    "inline-flex! h-11! w-11! shrink-0! items-center! justify-center! rounded-full! p-0!";

  return (
    <div className="mt-6">
      {/* Liên kết, bộ đếm và điều hướng. */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border pb-4 lg:justify-end lg:gap-x-5 lg:pb-5">
        <Link
          href="/explore"
          className="animated-underline inline-flex! min-h-11 items-center gap-1.5 text-xs font-semibold text-primary! transition-colors duration-200 hover:text-primary-hover! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-sm lg:order-2"
        >
          Xem tất cả chỗ ở
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>

        <div className="flex items-center gap-3 lg:contents">
          <p
            aria-live="polite"
            aria-atomic="true"
            className="m-0! whitespace-nowrap text-xs! tabular-nums sm:text-sm! lg:order-1"
          >
            <span className="font-semibold text-foreground">
              {String(current).padStart(2, "0")}
            </span>

            <span className="text-muted-foreground">
              {" / "}
              {String(rooms.length).padStart(2, "0")}
            </span>
          </p>

          <div className="flex items-center gap-2 lg:order-3">
            <AppButton
              type="default"
              htmlType="button"
              aria-label="Chỗ ở trước"
              disabled={!api || !canScrollPrev}
              onClick={() => api?.scrollPrev()}
              className={`${controlClassName} border-border! bg-card! text-card-foreground! enabled:hover:border-primary! enabled:hover:bg-accent! enabled:hover:text-accent-foreground!`}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </AppButton>

            <AppButton
              type="primary"
              htmlType="button"
              aria-label="Chỗ ở tiếp theo"
              disabled={!api || !canScrollNext}
              onClick={() => api?.scrollNext()}
              className={`${controlClassName} border-primary! bg-primary! text-primary-foreground! enabled:hover:border-primary-hover! enabled:hover:bg-primary-hover!`}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </AppButton>
          </div>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          slidesToScroll: 1,
          loop: false,
          duration: 30,
        }}
        aria-label="Gợi ý chỗ ở cho chuyến đi"
        className="mt-5 sm:mt-6 lg:mt-7"
      >
        <CarouselContent className="-ml-3 pb-2 sm:-ml-4 lg:-ml-6 lg:pb-14">
          {rooms.map((room, index) => {
            const position = index % 3;

            const staggerClassName =
              position === 1
                ? "lg:translate-y-6"
                : position === 2
                  ? "lg:translate-y-12"
                  : "";

            return (
              <CarouselItem
                key={room.id}
                className="basis-[86%] pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/3 lg:pl-6"
              >
                <div className={staggerClassName}>
                  <RoomCard
                    room={room}
                    locationLabel={
                      locations.get(room.maViTri) ?? "Khám phá điểm đến mới"
                    }
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
