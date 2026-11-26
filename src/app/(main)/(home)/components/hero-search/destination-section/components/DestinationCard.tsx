import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import type { DestinationType } from "../../../../../../../features/destinations/types/destination.types";
import { destinationDescriptions } from "../descriptions/descriptions";

type DestinationCardProps = {
  destination: DestinationType;
  className?: string;
};

export default function DestinationCard({
  destination,
  className = "",
}: DestinationCardProps) {
  const shortDescription =
    destinationDescriptions[destination.id]?.shortDescription ??
    "Tìm một chỗ nghỉ hợp gu và khám phá điểm đến theo cách của bạn.";

  return (
    <Link
      href={`/explore?destinationId=${destination.id}`}
      aria-label={`Khám phá chỗ ở tại ${destination.tenViTri}, ${destination.tinhThanh}`}
      className={`group relative isolate block min-h-44 overflow-hidden rounded-2xl bg-muted text-primary-foreground! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${className}`}
    >
      <img
        src={destination.hinhAnh}
        alt={`${destination.tenViTri}, ${destination.tinhThanh}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
      />

      {/* Giữ phần trên ảnh rõ, tăng tương phản ở vùng chữ. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/85 via-black/30 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-3 sm:gap-3 sm:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="m-0! font-heading text-base! font-semibold! leading-tight! text-primary-foreground! sm:text-2xl!">
            {destination.tinhThanh}
          </h3>

          <p className="mb-0! mt-1.5! flex min-w-0 items-center gap-1 text-xs! leading-5! text-primary-foreground/85! sm:mt-2! sm:gap-1.5 sm:text-sm!">
            <MapPin size={15} aria-hidden="true" className="shrink-0" />

            <span className="truncate">{destination.tenViTri}</span>
          </p>

          <p className="mb-0! mt-2! hidden text-sm! leading-5! text-primary-foreground/90! sm:line-clamp-2">
            {shortDescription}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground! backdrop-blur-sm transition-colors duration-200 group-hover:bg-primary group-focus-visible:bg-primary sm:size-9"
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
