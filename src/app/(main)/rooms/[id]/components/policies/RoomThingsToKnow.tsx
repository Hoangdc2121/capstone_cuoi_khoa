"use client";

import { useState } from "react";
import { Modal } from "antd";
import { roomPolicies } from "@/features/rooms/data/roomPolicies";

import AppButton from "@/components/common/AppButton";
import { ChevronRight } from "lucide-react";

export default function RoomThingsToKnow() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPolicy = roomPolicies.find(
    (policy) => policy.id === selectedId,
  );

  return (
    <section
      aria-labelledby="room-things-to-know-title"
      className="mt-12 border-t border-border py-10 sm:mt-16 sm:py-12"
    >
      <h2
        id="room-things-to-know-title"
        className="m-0! font-heading text-xl! font-semibold! text-foreground! sm:text-2xl!"
      >
        Những điều cần biết
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {roomPolicies.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex min-w-0 flex-col border-b border-border py-6 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={23}
                  strokeWidth={1.7}
                  aria-hidden="true"
                  className="shrink-0 text-primary"
                />

                <h3 className="m-0! text-sm! font-semibold! leading-6! text-foreground!">
                  {item.title}
                </h3>
              </div>

              <ul className="m-0! mt-3! list-none space-y-1.5 p-0! text-sm leading-6 text-muted-foreground">
                {item.preview.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>

              <div className="mt-auto pt-3">
                <AppButton
                  type="text"
                  htmlType="button"
                  onClick={() => setSelectedId(item.id)}
                  aria-label={`Hiển thị thêm: ${item.title}`}
                  className="group m-0! inline-flex! h-8! items-center! gap-1! rounded-md! px-0! text-base! font-semibold! text-foreground! transition-colors! hover:bg-transparent! hover:text-primary!"
                >
                  <span className="animated-underline group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                    Hiển thị thêm
                  </span>

                  <ChevronRight size={14} aria-hidden="true" />
                </AppButton>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={Boolean(selectedPolicy)}
        onCancel={() => setSelectedId(null)}
        centered
        width={600}
        footer={null}
        title={
          selectedPolicy && (
            <div className="flex items-center gap-3 pr-8">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <selectedPolicy.icon
                  size={22}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <span className="text-lg font-semibold text-foreground">
                {selectedPolicy.title}
              </span>
            </div>
          )
        }
      >
        <ul className="m-0! mt-5! max-h-[60dvh] list-none divide-y divide-border overflow-y-auto p-0!">
          {selectedPolicy?.details.map((text) => (
            <li
              key={text}
              className="py-4 text-sm leading-7 text-muted-foreground first:pt-0 last:pb-0"
            >
              {text}
            </li>
          ))}
        </ul>
      </Modal>
    </section>
  );
}
