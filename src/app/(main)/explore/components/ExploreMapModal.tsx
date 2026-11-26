"use client";

import { Modal } from "antd";
import { MapPin } from "lucide-react";

import type { DestinationType } from "@/features/destinations/types/destination.types";
import {
  DESTINATION_MAP_BOUNDS,
  VIETNAM_MAP_BOUNDS,
} from "@/config/destination-map.config";

type ExploreMapModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination?: DestinationType;
};

export default function ExploreMapModal({
  open,
  onOpenChange,
  destination,
}: ExploreMapModalProps) {
  const locationLabel = destination
    ? `${destination.tenViTri}, ${destination.tinhThanh}`
    : "Việt Nam";

  const bounds = destination
    ? DESTINATION_MAP_BOUNDS[destination.id]
    : VIETNAM_MAP_BOUNDS;

  const mapSrc = bounds
    ? `https://www.openstreetmap.org/export/embed.html?${new URLSearchParams({
        bbox: bounds.join(","),
        layer: "mapnik",
      }).toString()}`
    : undefined;

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      centered
      width={1000}
      footer={null}
      title={
        <span className="flex items-center gap-2 pr-8 text-foreground">
          <MapPin
            size={20}
            aria-hidden="true"
            className="shrink-0 text-foreground"
          />

          <span>Khu vực {locationLabel}</span>
        </span>
      }
    >
      <div className="pt-3">
        <div className="h-[50dvh] min-h-64 max-h-140 overflow-hidden rounded-2xl border border-border bg-muted">
          {open && mapSrc ? (
            <iframe
              key={mapSrc}
              title={`Bản đồ khu vực ${locationLabel}`}
              src={mapSrc}
              referrerPolicy="strict-origin-when-cross-origin"
              className="block h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <p
                role="status"
                className="m-0! text-center text-sm! text-muted-foreground!"
              >
                Chưa cấu hình bản đồ cho khu vực này.
              </p>
            </div>
          )}
        </div>

        <p className="mb-0! mt-3! text-xs! leading-5! text-muted-foreground!">
          Bản đồ hiển thị khu vực tìm kiếm, không phải vị trí chính xác của từng
          chỗ ở.
        </p>
      </div>
    </Modal>
  );
}
