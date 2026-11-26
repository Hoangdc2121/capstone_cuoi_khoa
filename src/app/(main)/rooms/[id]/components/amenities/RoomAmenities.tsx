"use client";

import { useId, useState } from "react";
import { Modal } from "antd";

import AppButton from "@/components/common/AppButton";
import type { RoomType } from "@/features/rooms/types/room.types";
import getRoomAmenities from "@/features/rooms/utils/getRoomAmenities";

type RoomAmenitiesProps = {
  room: RoomType;
};

export default function RoomAmenities({ room }: RoomAmenitiesProps) {
  const titleId = useId();
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  const { groups, allAmenities, previewAmenities } = getRoomAmenities(room);

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <h2
        id={titleId}
        className="m-0! text-xl! font-semibold! text-foreground! sm:text-2xl!"
      >
        Nơi này có những gì cho bạn
      </h2>

      {/* Danh sách xem trước. */}
      <ul className="m-0! mt-6! grid list-none grid-cols-2 gap-x-6 gap-y-0 p-0!">
        {previewAmenities.map(({ id, label, icon: Icon }) => (
          <li
            key={id}
            className="flex min-w-0 items-center gap-3 py-4 text-sm text-foreground"
          >
            <Icon
              size={23}
              strokeWidth={1.6}
              aria-hidden="true"
              className="shrink-0 text-muted-foreground"
            />

            <span className="leading-6">{label}</span>
          </li>
        ))}
      </ul>

      <AppButton
        type="default"
        htmlType="button"
        onClick={() => setAmenitiesOpen(true)}
        className="mt-7! h-11! rounded-xl! border-border! bg-transparent! px-5! font-medium! text-foreground! transition-colors! duration-200! hover:border-primary! hover:bg-accent!"
      >
        Hiển thị tất cả {allAmenities.length} tiện nghi
      </AppButton>

      {/* Danh sách đầy đủ theo nhóm, không có thanh tìm kiếm. */}
      <Modal
        open={amenitiesOpen}
        onCancel={() => setAmenitiesOpen(false)}
        centered
        width={640}
        footer={null}
        title="Nơi này có những gì cho bạn"
      >
        <div className="mt-4 max-h-[65dvh] overflow-y-auto pr-3">
          {groups.map((group) => (
            <section
              key={group.title}
              aria-label={group.title}
              className="mb-7 last:mb-0"
            >
              <h3 className="m-0! text-base! font-semibold! text-foreground!">
                {group.title}
              </h3>

              <ul className="m-0! mt-2! list-none divide-y divide-border p-0!">
                {group.items.map(({ id, label, icon: Icon }) => (
                  <li
                    key={id}
                    className="flex items-center gap-4 py-5 text-sm text-foreground"
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground"
                    />

                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </section>
  );
}
