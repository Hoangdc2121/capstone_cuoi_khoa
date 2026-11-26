"use client";

import { mobileCollageTiles } from "@/app/(main)/rooms/[id]/components/images/data/roomDetailImageData";
import { Image } from "antd";
import { Images } from "lucide-react";
import useRoomDetailImage from "./hooks/useRoomDetailImage";

type RoomDetailImageProps = {
  image: string;
  name: string;
  images?: readonly string[];
};

export default function RoomDetailImage({
  image,
  name,
  images = [],
}: RoomDetailImageProps) {
  const { previewOpen, setPreviewOpen, galleryImages } = useRoomDetailImage(
    image,
    images,
  );
  const coverImage = galleryImages[0];
  return (
    <div className="relative isolate h-105 w-full overflow-hidden rounded-b-2xl bg-background sm:h-115 lg:h-auto lg:rounded-none">
      {coverImage ? (
        <>
          <div
            role="img"
            aria-label={`Ảnh chỗ ở ${name}`}
            className="absolute inset-0 grid grid-cols-2 grid-rows-4 gap-0.5 bg-background sm:hidden"
          >
            {mobileCollageTiles.map(({ viewBox, className }) => (
              <svg
                key={viewBox}
                aria-hidden="true"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid slice"
                className={`block size-full min-h-0 min-w-0 overflow-hidden ${className}`}
              >
                <image
                  href={coverImage}
                  width={440}
                  height={154}
                  preserveAspectRatio="none"
                />
              </svg>
            ))}
          </div>

          <img
            src={coverImage}
            alt={name}
            decoding="async"
            draggable={false}
            className="hidden h-auto w-full select-none sm:block max-lg:absolute max-lg:inset-0 max-lg:h-full max-lg:object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background lg:h-24"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background"
          />

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="absolute bottom-5 right-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background/95 px-4 text-sm font-semibold text-foreground shadow-lg transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:bottom-8 sm:right-8"
          >
            <Images size={18} aria-hidden="true" />
            {galleryImages.length > 1
              ? `Xem tất cả ${galleryImages.length} ảnh`
              : "Xem ảnh phòng"}
          </button>

          <Image.PreviewGroup
            items={galleryImages.map((src, index) => ({
              src,
              alt: `${name} · ảnh ${index + 1}`,
            }))}
            classNames={{
              popup: {
                root: [
                  "z-[2000]!",
                  "max-lg:[--room-preview-height:min(100dvh,26.25rem)]",
                  "sm:max-lg:[--room-preview-height:min(100dvh,28.75rem)]",
                ].join(" "),
                mask: "bg-black/45! backdrop-blur-none!",
                body: "max-lg:top-0! max-lg:bottom-auto! max-lg:h-[calc(var(--room-preview-height)_-_3.5rem)]!",
                footer:
                  "max-lg:top-[calc(var(--room-preview-height)_-_3.5rem)]! max-lg:bottom-auto! max-lg:-translate-y-20!",
              },
            }}
            preview={{
              open: previewOpen,
              onOpenChange: setPreviewOpen,
              countRender: (current, total) =>
                total > 1 ? `${current} / ${total}` : null,
            }}
          />
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
          Chưa có hình ảnh
        </div>
      )}
    </div>
  );
}
