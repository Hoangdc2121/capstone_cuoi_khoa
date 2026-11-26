"use client";

import AppButton from "@/components/common/AppButton";
import type { DestinationType } from "../../../../../../../../features/destinations/types/destination.types";

type DestinationItemProps = {
  destination: DestinationType;
  onSelect: (destination: DestinationType) => void;
};

export default function DestinationItem({
  destination,
  onSelect,
}: DestinationItemProps) {
  const label = `${destination.tenViTri}, ${destination.tinhThanh}`;

  return (
    <AppButton
      type="default"
      htmlType="button"
      title={label}
      aria-label={`Chọn ${label}`}
      onClick={() => onSelect(destination)}
      className="group block! h-auto! w-full! min-w-0! whitespace-normal! rounded-xl! border-border! bg-card! p-2! text-left! shadow-none! transition-[background-color,border-color]! duration-300! ease-out! hover:border-secondary! hover:bg-accent! motion-reduce:transition-none!"
    >
      <span className="block w-full min-w-0">
        <span className="block aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={destination.hinhAnh}
            alt=""
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          />
        </span>

        <span className="block px-1 pb-1 pt-2">
          <span className="block truncate text-sm font-semibold leading-5 text-card-foreground">
            {destination.tenViTri}
          </span>

          <span className="mt-1 block truncate text-xs font-normal leading-4 text-muted-foreground">
            {destination.tinhThanh}
          </span>
        </span>
      </span>
    </AppButton>
  );
}
