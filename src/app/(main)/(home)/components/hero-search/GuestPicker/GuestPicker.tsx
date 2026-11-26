"use client";

import { ChevronDown, Minus, Plus, UsersRound } from "lucide-react";
import { Button, InputNumber, Space } from "antd";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type GuestPickerProps = {
  id: string;
  value: string;
  open: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
  onStep: (step: number) => void;
  triggerClassName: string;
  popupClassName: string;
};

export default function GuestPicker({
  id,
  value,
  open,
  error,
  onOpenChange,
  onChange,
  onStep,
  triggerClassName,
  popupClassName,
}: GuestPickerProps) {
  return (
    <div className="min-w-0 border-t border-primary-foreground/25 px-4 lg:border-l lg:border-t-0">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Chọn số khách, hiện tại ${value || 0} khách`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={triggerClassName}
          >
            <UsersRound size={20} aria-hidden="true" className="shrink-0" />

            <span className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5">
              {error && (
                <span
                  id={`${id}-error`}
                  role="alert"
                  className="text-xs leading-5 text-destructive!"
                >
                  {error}
                </span>
              )}

              <span className="truncate text-sm font-medium leading-5">
                {value ? `${value} khách` : "Chọn số khách"}
              </span>
            </span>

            <ChevronDown
              size={14}
              aria-hidden="true"
              className="shrink-0 cursor-pointer text-muted-foreground lg:text-primary-foreground"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={12}
          collisionPadding={12}
          className={popupClassName}
        >
          <h2 className="m-0! text-sm! font-semibold!">Số lượng khách</h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Số khách</span>

            <Space.Compact className="shrink-0">
              <Button
                htmlType="button"
                aria-label="Giảm số khách"
                disabled={value === "" || Number(value) <= 1}
                icon={<Minus size={15} aria-hidden="true" />}
                onClick={() => onStep(-1)}
                className="h-9! w-9! shrink-0! border-border! bg-card! text-card-foreground! disabled:opacity-40"
              />

              <InputNumber<number>
                id={id}
                aria-label="Số khách"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                min={1}
                max={Number.MAX_SAFE_INTEGER}
                step={1}
                precision={0}
                controls={false}
                value={value === "" ? null : Number(value)}
                onChange={(nextValue) => {
                  onChange(nextValue === null ? "" : String(nextValue));
                }}
                status={error ? "error" : undefined}
                className="h-9! w-20! shrink-0! border-border! bg-card! [&_.ant-input-number-input-wrap]:h-full! [&_.ant-input-number-input]:h-full! [&_.ant-input-number-input]:w-full! [&_.ant-input-number-input]:px-1! [&_.ant-input-number-input]:text-center! [&_.ant-input-number-input]:text-base! [&_.ant-input-number-input]:text-card-foreground!"
              />

              <Button
                htmlType="button"
                aria-label="Tăng số khách"
                disabled={Number(value) >= Number.MAX_SAFE_INTEGER}
                icon={<Plus size={15} aria-hidden="true" />}
                onClick={() => onStep(1)}
                className="h-9! w-9! shrink-0! border-border! bg-card! text-card-foreground! hover:border-secondary! hover:text-secondary! disabled:opacity-40"
              />
            </Space.Compact>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
