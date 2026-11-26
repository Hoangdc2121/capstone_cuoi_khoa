"use client";

import { useEffect, useState } from "react";

import type { CarouselApi } from "@/components/ui/carousel";

export default function useCarouselControls(activeIndex?: number) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Đồng bộ trạng thái các nút điều khiển.
  useEffect(() => {
    if (!api) return;

    const carouselApi = api;

    function updateControls() {
      setSelected(carouselApi.selectedScrollSnap());
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    }

    updateControls();

    carouselApi.on("select", updateControls);
    carouselApi.on("reInit", updateControls);

    return () => {
      carouselApi.off("select", updateControls);
      carouselApi.off("reInit", updateControls);
    };
  }, [api]);

  // Cuộn tới mục được chọn khi có truyền activeIndex.
  useEffect(() => {
    if (
      !api ||
      activeIndex === undefined ||
      !Number.isInteger(activeIndex) ||
      activeIndex < 0
    ) {
      return;
    }

    const carouselApi = api;
    const targetIndex = activeIndex;

    function scrollToActive() {
      carouselApi.scrollTo(targetIndex, true);
    }

    scrollToActive();

    carouselApi.on("reInit", scrollToActive);

    return () => {
      carouselApi.off("reInit", scrollToActive);
    };
  }, [api, activeIndex]);

  return {
    api,
    setApi,
    selected,
    canScrollPrev,
    canScrollNext,
  };
}