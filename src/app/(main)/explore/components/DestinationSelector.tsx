"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import useCarouselControls from "@/hooks/useCarouselControls";
import AppButton from "@/components/common/AppButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type DestinationOption = {
  id: number | undefined;
  title: string;
  subtitle: string;
  image: string;
};

type DestinationSelectorProps = {
  options: DestinationOption[];
  destinationId?: number;
  invalidDestinationId: boolean;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (id?: number) => void;
};

const controlClassName =
  "inline-flex! size-11! items-center justify-center rounded-full! p-0!";

export default function DestinationSelector({
  options,
  destinationId,
  invalidDestinationId,
  loading,
  error,
  onRetry,
  onSelect,
}: DestinationSelectorProps) {
  const activeIndex =
    invalidDestinationId || loading || error
      ? undefined
      : options.findIndex((item) => item.id === destinationId);

  const { api, setApi, canScrollPrev, canScrollNext } =
    useCarouselControls(activeIndex);

  return (
    <div className="min-w-0">
      {loading ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-card/95 p-4"
        >
          <p className="m-0! text-sm! text-muted-foreground!">
            Đang tải khu vực…
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-border bg-card/95 p-4">
          <p role="alert" className="m-0! text-sm! text-destructive!">
            {error}
          </p>

          <AppButton htmlType="button" onClick={onRetry} className="mt-3">
            Thử lại
          </AppButton>
        </div>
      ) : (
        <div className="py-14">
          <Carousel
            setApi={setApi}
            orientation="vertical"
            opts={{
              align: "start",
              loop: false,
              slidesToScroll: 1,
            }}
            aria-label="Chọn khu vực"
            className="relative w-full min-w-0"
          >
            <div className="absolute inset-x-0 -top-14 flex justify-center">
              <AppButton
                type="default"
                htmlType="button"
                aria-label="Xem khu vực phía trên"
                disabled={!api || !canScrollPrev}
                onClick={() => api?.scrollPrev()}
                className={`${controlClassName} border-border! bg-card! text-card-foreground! enabled:hover:border-primary! enabled:hover:bg-accent! enabled:hover:text-accent-foreground!`}
              >
                <ArrowUp size={19} aria-hidden="true" />
              </AppButton>
            </div>

            <CarouselContent className="-mt-3 h-[192px] lg:h-[336px]">
              {options.map((item) => {
                const active =
                  !invalidDestinationId && destinationId === item.id;

                const image = item.image?.trim();

                return (
                  <CarouselItem
                    key={item.id ?? "all"}
                    className="min-h-0 basis-1/2 pt-3 lg:basis-1/3"
                  >
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "flex h-full w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring",
                        active
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card/95 text-card-foreground hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="size-12 shrink-0 select-none rounded-lg object-cover lg:size-14"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="size-12 shrink-0 rounded-lg bg-muted lg:size-14"
                        />
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {item.title}
                        </span>

                        <span
                          className={cn(
                            "mt-1 block truncate text-xs",
                            active
                              ? "text-accent-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {item.subtitle}
                        </span>
                      </span>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="absolute inset-x-0 -bottom-14 flex justify-center">
              <AppButton
                type="primary"
                htmlType="button"
                aria-label="Xem khu vực phía dưới"
                disabled={!api || !canScrollNext}
                onClick={() => api?.scrollNext()}
                className={`${controlClassName} border-primary! bg-primary! text-primary-foreground! enabled:hover:border-primary-hover! enabled:hover:bg-primary-hover!`}
              >
                <ArrowDown size={19} aria-hidden="true" />
              </AppButton>
            </div>
          </Carousel>
        </div>
      )}
    </div>
  );
}
