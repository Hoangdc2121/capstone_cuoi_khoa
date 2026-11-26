"use client";

import { useId } from "react";
import { vi } from "date-fns/locale";
import { AnimatedCalendar } from "@/components/ui/calender";

export type DateRangeValue = {
  checkIn: string;
  checkOut: string;
};

type BaseProps = {
  label: string;
  error?: string;
  placeholder?: string;
  className?: string;
  hideLabel?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  disablePastDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

type AppDatePickerProps =
  | (BaseProps & {
      mode?: "single";
      value?: string;
      onChange: (value: string) => void;
    })
  | (BaseProps & {
      mode: "range";
      value: DateRangeValue;
      onChange: (value: DateRangeValue) => void;
      bookedRanges?: readonly DateRangeValue[];
    });

const localeStrings = {
  weekdays: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  months: Array.from({ length: 12 }, (_, index) => `Tháng ${index + 1}`),
  monthsShort: Array.from({ length: 12 }, (_, index) => `Th${index + 1}`),
  today: "Hôm nay",
  clear: "Xóa",
  close: "Đóng",
  selectTime: "Chọn giờ",
  backToCalendar: "Quay lại lịch",
  selected: "đã chọn",
  weekNumber: "Tuần",
};

function toDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function toDateString(date: Date | undefined): string {
  if (!date) return "";

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function AppDatePicker(props: AppDatePickerProps) {
  const id = useId();

  const commonProps = {
    id,
    locale: vi,
    localeStrings,
    weekStartsOn: 1 as const,
    formatStr: "dd/MM/yyyy",
    size: props.size ?? "md",
    disabled: props.disabled ?? false,
    disablePastDates: props.disablePastDates ?? false,
    minDate: props.minDate,
    maxDate: props.maxDate,
    error: Boolean(props.error),
    errorMessage: props.error,
    className: props.className,
  };

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className={
          props.hideLabel ? "sr-only" : "mb-2 block text-sm font-medium"
        }
      >
        {props.label}
      </label>

      {props.mode === "range" ? (
        <AnimatedCalendar
          {...commonProps}
          mode="range"
          bookedRanges={props.bookedRanges}
          value={{
            from: toDate(props.value.checkIn),
            to: toDate(props.value.checkOut),
          }}
          onChange={(range) => {
            props.onChange({
              checkIn: toDateString(range?.from),
              checkOut: toDateString(range?.to),
            });
          }}
          placeholder={props.placeholder ?? "Chọn ngày nhận – trả"}
          showTodayButton={false}
          showClearButton
          closeOnSelect
          monthsToShow={1}
        />
      ) : (
        <AnimatedCalendar
          {...commonProps}
          mode="single"
          value={toDate(props.value ?? "")}
          onChange={(date) => props.onChange(toDateString(date))}
          placeholder={props.placeholder ?? "Chọn ngày"}
        />
      )}
    </div>
  );
}
