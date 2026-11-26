"use client";

import AppDatePicker, {
  type DateRangeValue,
} from "@/components/common/AppDatePicker";
import { cn } from "@/lib/utils";

type StayDatePickerProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  variant?: "hero" | "card";
  error?: string;
};

export default function StayDatePicker({
  value,
  onChange,
  variant = "hero",
  error,
}: StayDatePickerProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "min-w-0 px-4",
        isHero &&
          "border-t border-border lg:border-l lg:border-t-0 lg:border-primary-foreground/25",
      )}
    >
      <div className="flex h-16 min-w-0 items-center lg:h-14">
        <div className="min-w-0 flex-1">
          <p
            role={error ? "alert" : undefined}
            className={cn(
              "m-0! mb-0.5! text-xs! leading-5!",
              error
                ? "text-destructive!"
                : isHero
                  ? "text-muted-foreground lg:text-primary-foreground/70"
                  : "text-muted-foreground",
            )}
          >
            {error || "Thời gian lưu trú"}
          </p>

          <AppDatePicker
            mode="range"
            hideLabel
            size="sm"
            label="Thời gian lưu trú"
            placeholder="Chọn ngày nhận – trả"
            value={value}
            onChange={onChange}
            disablePastDates
            className={cn(
              "h-7! w-full! cursor-pointer rounded-none! border-0! bg-transparent! px-0! text-sm! font-medium! text-card-foreground! shadow-none! hover:bg-transparent! [&_svg]:mr-0! [&_svg:last-of-type]:translate-y-0",
              isHero &&
                "lg:text-primary-foreground! lg:[&_svg:last-of-type]:-translate-y-2",
            )}
          />
        </div>
      </div>
    </div>
  );
}
