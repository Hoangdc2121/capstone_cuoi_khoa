"use client";

import { useId, useState } from "react";
import { ChevronRight, Heart, MapPin, Share2 } from "lucide-react";

import getRoomOverview from "@/features/rooms/utils/getRoomOverview";

import AppButton from "@/components/common/AppButton";
import useDestinations from "@/features/destinations/hooks/useDestinations";
import type { RoomType } from "@/features/rooms/types/room.types";

type RoomOverviewProps = {
  room: RoomType;
};

export default function RoomOverview({ room }: RoomOverviewProps) {
  const titleId = useId();
  const descriptionTitleId = useId();
  const descriptionId = useId();

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const { destinations } = useDestinations(true);

  const { locationLabel, description, roomStats } = getRoomOverview(
    room,
    destinations,
  );

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <header>
        {/* Tên phòng. */}
        <h1
          id={titleId}
          className="m-0! text-pretty font-heading text-2xl! font-semibold! leading-tight! text-foreground! sm:text-3xl!"
        >
          {room.tenPhong}
        </h1>

        {/* Địa chỉ. */}
        {locationLabel && (
          <p className="mb-3! mt-2! flex items-start gap-2 text-sm! leading-6! text-muted-foreground!">
            <MapPin
              size={17}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-muted-foreground"
            />

            <span>{locationLabel}</span>
          </p>
        )}

        {/* Giá, chia sẻ và lưu. */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0! text-sm! text-muted-foreground!">
            <span className="text-2xl font-semibold text-foreground">
              {room.giaTien} USD
            </span>

            {" / đêm"}
          </p>

          <div className="flex items-center gap-1">
            <AppButton
              type="text"
              htmlType="button"
              className="inline-flex! h-10! items-center! gap-2! rounded-xl! px-3! text-foreground! transition-colors! duration-300! hover:bg-accent!"
            >
              <Share2 size={17} aria-hidden="true" />
              <span>Chia sẻ</span>
            </AppButton>

            <AppButton
              type="text"
              htmlType="button"
              className="inline-flex! h-10! items-center! gap-2! rounded-xl! px-3! text-foreground! transition-colors! duration-300! hover:bg-accent!"
            >
              <Heart size={17} aria-hidden="true" />
              <span>Lưu</span>
            </AppButton>
          </div>
        </div>
      </header>

      {/* Sức chứa và không gian. */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {roomStats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5"
          >
            <Icon
              size={18}
              aria-hidden="true"
              className="shrink-0 text-primary"
            />

            <div>
              <span className="block text-sm font-semibold text-card-foreground">
                {value}
              </span>

              <span className="block text-xs text-muted-foreground">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mô tả phòng. */}
      <section
        aria-labelledby={descriptionTitleId}
        className="mt-8 border-t border-border pt-8"
      >
        <h2
          id={descriptionTitleId}
          className="m-0! text-xl! font-semibold! text-foreground! sm:text-2xl!"
        >
          Về chỗ ở này
        </h2>

        <p
          id={descriptionId}
          className={[
            "mb-0! mt-4! whitespace-pre-line text-sm! leading-7! text-muted-foreground! sm:text-base!",
            descriptionExpanded ? "" : "line-clamp-4",
          ].join(" ")}
        >
          {description || "Chưa có mô tả cho chỗ ở này."}
        </p>

        {description && (
          <AppButton
            type="text"
            htmlType="button"
            aria-expanded={descriptionExpanded}
            aria-controls={descriptionId}
            onClick={() => setDescriptionExpanded((previous) => !previous)}
            className="mt-3! inline-flex! h-10! items-center! gap-1.5! rounded-lg! px-0! font-semibold! text-foreground! hover:bg-transparent! hover:text-primary!"
          >
            <span className="animated-underline group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
              {descriptionExpanded ? "Thu gọn" : "Hiển thị thêm"}
            </span>

            <ChevronRight
              size={17}
              aria-hidden="true"
              className={[
                "transition-transform duration-200",
                descriptionExpanded ? "-rotate-90" : "rotate-90",
              ].join(" ")}
            />
          </AppButton>
        )}
      </section>
    </section>
  );
}
