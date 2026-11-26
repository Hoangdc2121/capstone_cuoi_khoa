"use client";

import { useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import useDestinations from "@/features/destinations/hooks/useDestinations";

import useRooms from "@/features/rooms/hooks/useRooms";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

import { destinationDescriptions } from "../../(home)/components/hero-search/destination-section/descriptions/descriptions";
import { getDestinationPath } from "@/features/destinations/utils/destination-path.utils";

const ALL_DESTINATIONS_IMAGE = "/img/rooms-banner.png";

const DESTINATION_HERO_IMAGES: Record<number, string> = {};

const DEFAULT_DESCRIPTION =
  "Tìm một chỗ nghỉ hợp gu và khám phá điểm đến theo cách của bạn.";

export default function useExplore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug?: string }>();

  const roomsRef = useRef<HTMLDivElement>(null);

  const roomsVisible = useIntersectionObserver(roomsRef, {
    threshold: 0,
    rootMargin: "0px",
    once: true,
  });

  // URL mới: /explore/cai-rang-can-tho-2.
  // Vẫn đọc được URL cũ: /explore?destinationId=2.
  const rawDestinationId =
    slug === undefined
      ? searchParams.get("destinationId")
      : (slug.match(/-([1-9]\d*)$/)?.[1] ?? "");

  const parsedDestinationId = Number(rawDestinationId);

  const invalidDestinationId =
    rawDestinationId !== null &&
    (!/^[1-9]\d*$/.test(rawDestinationId) ||
      !Number.isSafeInteger(parsedDestinationId));

  const destinationId =
    rawDestinationId !== null && !invalidDestinationId
      ? parsedDestinationId
      : undefined;

  const {
    destinations,
    loading: destinationsLoading,
    error: destinationsError,
    retry: retryDestinations,
  } = useDestinations(true);

  const {
    rooms: allRooms,
    loading: roomsLoading,
    error: roomsError,
    retry: retryRooms,
  } = useRooms(roomsVisible && !invalidDestinationId, destinationId);

  const rawGuests = searchParams.get("guests");
  const parsedGuests = Number(rawGuests);

  const guestCount =
    rawGuests !== null &&
    /^[1-9]\d*$/.test(rawGuests) &&
    Number.isSafeInteger(parsedGuests)
      ? parsedGuests
      : undefined;

  const rooms =
    guestCount === undefined
      ? allRooms
      : allRooms.filter((room) => room.khach >= guestCount);

  const selectedDestination = destinations.find(
    (destination) => destination.id === destinationId,
  );

  function handleSelectDestination(id?: number) {
    let nextPath = "/explore";

    if (id !== undefined) {
      const destination = destinations.find((item) => item.id === id);

      if (!destination) return;

      nextPath = getDestinationPath(destination);
    }

    // Giữ ngày và số khách khi đổi khu vực.
    const params = new URLSearchParams(searchParams.toString());

    params.delete("destinationId");
    params.delete("page");

    const query = params.toString();

    router.replace(query ? `${nextPath}?${query}` : nextPath, {
      scroll: false,
    });
  }

  const heroTitle = invalidDestinationId
    ? "Khám phá điểm đến"
    : destinationId === undefined
      ? "Một chuyến đi đáng nhớ."
      : (selectedDestination?.tinhThanh ?? "Khám phá khu vực");

  const heroImage =
    destinationId === undefined
      ? ALL_DESTINATIONS_IMAGE
      : DESTINATION_HERO_IMAGES[destinationId] ||
        selectedDestination?.hinhAnh ||
        ALL_DESTINATIONS_IMAGE;

  const destinationOptions = [
    {
      id: undefined,
      title: "Tất cả",
      subtitle: "Khám phá mọi khu vực",
      image: ALL_DESTINATIONS_IMAGE,
    },
    ...destinations.slice(0, 10).map((destination) => ({
      id: destination.id,
      title: destination.tinhThanh,
      subtitle: destination.tenViTri,
      image: destination.hinhAnh,
    })),
  ];

  const heroDescription =
    destinationId === undefined || invalidDestinationId
      ? DEFAULT_DESCRIPTION
      : (destinationDescriptions[destinationId]?.shortDescription ??
        DEFAULT_DESCRIPTION);

  const resultsTitle = invalidDestinationId
    ? "Khám phá chỗ ở"
    : destinationId === undefined
      ? "Tất cả chỗ ở"
      : selectedDestination
        ? `Chỗ ở tại ${selectedDestination.tenViTri}, ${selectedDestination.tinhThanh}`
        : "Chỗ ở theo khu vực";

  return {
    roomsRef,
    roomsVisible,

    destinations,
    destinationsLoading,
    destinationsError,
    retryDestinations,

    rooms,
    roomsLoading,
    roomsError,
    retryRooms,

    destinationId,
    invalidDestinationId,
    selectedDestination,
    handleSelectDestination,

    heroTitle,
    heroImage,
    heroDescription,
    destinationOptions,
    resultsTitle,
  };
}