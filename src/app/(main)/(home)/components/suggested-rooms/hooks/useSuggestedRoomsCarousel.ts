"use client";

import { useMemo } from "react";

import useCarouselControls from "@/hooks/useCarouselControls";
import type { DestinationType } from "../../../../../../features/destinations/types/destination.types";

type Options = {
  destinations: DestinationType[];
  itemCount: number;
};

export default function useSuggestedRoomsCarousel({
  destinations,
  itemCount,
}: Options) {
  const controls = useCarouselControls();

  const locations = useMemo(
    () =>
      new Map(
        destinations.map((destination) => [
          destination.id,
          `${destination.tenViTri}, ${destination.tinhThanh}`,
        ]),
      ),
    [destinations],
  );

  const current =
    itemCount > 0 ? controls.selected + 1 : 0;

  return {
    ...controls,
    locations,
    current,
  };
}