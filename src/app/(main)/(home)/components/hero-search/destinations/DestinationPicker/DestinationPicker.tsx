"use client";

import { ChevronDown, MapPin } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useDestinations from "@/features/destinations/hooks/useDestinations";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

import DestinationList from "./components/DestinationList";

type DestinationPickerProps = {
  id: string;
  value: string;
  open: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
  triggerClassName: string;
};

export default function DestinationPicker({
  id,
  value,
  open,
  error,
  onOpenChange,
  onChange,
  triggerClassName,
}: DestinationPickerProps) {
  const {
    destinations,
    loading,
    error: loadError,
    retry,
  } = useDestinations(open);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const trigger = (
    <button
      id={id}
      type="button"
      aria-label={value ? `Địa điểm: ${value}` : "Chọn điểm đến"}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={triggerClassName}
    >
      <MapPin size={18} aria-hidden="true" className="shrink-0" />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          id={error ? `${id}-error` : undefined}
          role={error ? "alert" : undefined}
          className={cn(
            "text-xs leading-5",
            error
              ? "text-destructive!"
              : "text-muted-foreground lg:text-primary-foreground/70",
          )}
        >
          {error || "Địa điểm"}
        </span>

        <span className="cursor-pointer truncate text-sm font-medium">
          {value || "Chọn điểm đến"}
        </span>
      </span>

      <ChevronDown
        size={14}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground lg:text-primary-foreground"
      />
    </button>
  );

  const content = loading ? (
    <div
      role="status"
      aria-label="Đang tải địa điểm"
      className="grid grid-cols-2 gap-3 p-1"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="rounded-xl border border-border p-2">
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  ) : loadError ? (
    <div className="rounded-xl bg-muted p-3">
      <p role="alert" className="text-sm text-destructive">
        {loadError}
      </p>

      <button
        type="button"
        onClick={retry}
        className="mt-2 cursor-pointer text-sm font-semibold text-primary"
      >
        Thử lại
      </button>
    </div>
  ) : (
    <DestinationList
      destinations={destinations}
      onSelect={(destination) => {
        onChange(`${destination.tenViTri}, ${destination.tinhThanh}`);
        onOpenChange(false);
      }}
    />
  );

  return (
    <div className="min-w-0 px-4">
      {isDesktop ? (
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={12}
            avoidCollisions
            collisionPadding={16}
            className="z-[60] flex w-96 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl"
            style={{
              maxHeight:
                "min(520px, var(--radix-popover-content-available-height))",
            }}
          >
            <div className="shrink-0">
              <h2 className="m-0! text-base! font-semibold! leading-6!">
                Chọn điểm đến
              </h2>

              <p className="mb-0! mt-1! text-xs! leading-5! text-muted-foreground">
                Chọn khu vực bạn muốn lưu trú
              </p>
            </div>

            <div className="mt-3 min-h-0 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
              {content}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>

          <DialogContent className="z-[60] flex! max-h-[calc(100dvh-2rem)]! w-[calc(100vw-2rem)]! max-w-md! flex-col gap-0! overflow-hidden rounded-2xl! border-border bg-popover p-4! text-popover-foreground">
            <DialogHeader className="shrink-0 gap-1! pr-8 text-left">
              <DialogTitle className="m-0! text-base! font-semibold! leading-6!">
                Chọn điểm đến
              </DialogTitle>

              <DialogDescription className="m-0! text-xs! leading-5! text-muted-foreground">
                Chọn khu vực bạn muốn lưu trú
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 min-h-0 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
              {content}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
