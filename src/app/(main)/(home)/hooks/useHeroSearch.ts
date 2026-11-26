"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import useDestinations from "@/features/destinations/hooks/useDestinations";
import useStaySearch from "@/features/stay-search/hooks/useStaySearch";
import useSearchHistory, {
  type SearchHistoryItem,
} from "@/features/stay-search/hooks/useSearchHistory";
import type { StaySearchErrors } from "@/features/stay-search/types/search.types";
import {
  getTodayString,
  isValidDate,
} from "@/features/stay-search/utils/date.utils";
import { getDestinationPath } from "@/features/destinations/utils/destination-path.utils";

type SearchErrors = StaySearchErrors & {
  destination?: string;
};

export default function useHeroSearch() {
  const router = useRouter();
  const staySearch = useStaySearch();

  const { history, saveDestinationSearch, clearHistory } = useSearchHistory();

  const [destination, setDestination] = useState("");
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [destinationError, setDestinationError] = useState<
    string | undefined
  >();

  const { destinations, loading: destinationsLoading } = useDestinations(
    destinationOpen || Boolean(destination),
  );

  const errors: SearchErrors = {
    ...staySearch.errors,
    destination: destinationError,
  };

  function clearError(field: keyof SearchErrors) {
    if (field === "destination") {
      setDestinationError(undefined);
      return;
    }

    staySearch.clearError(field);
  }

  function selectHistory(item: SearchHistoryItem) {
    setDestination(item.destination);
    setDestinationError(undefined);

    const validDates =
      isValidDate(item.checkIn) &&
      isValidDate(item.checkOut) &&
      item.checkIn >= getTodayString() &&
      item.checkOut > item.checkIn;

    staySearch.setCheckIn(validDates ? item.checkIn : "");
    staySearch.setCheckOut(validDates ? item.checkOut : "");

    const guestCount = Number(item.guests);

    staySearch.setGuests(
      Number.isSafeInteger(guestCount) && guestCount >= 1
        ? String(guestCount)
        : "2",
    );

    staySearch.clearError("checkIn");
    staySearch.clearError("checkOut");
    staySearch.clearError("guests");

    setDestinationOpen(false);
    staySearch.setGuestsOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validStay = staySearch.validate();

    const selectedDestination = destinations.find(
      (item) => `${item.tenViTri}, ${item.tinhThanh}` === destination.trim(),
    );

    if (!destination.trim()) {
      setDestinationError("Vui lòng chọn điểm đến.");
    } else if (!selectedDestination) {
      setDestinationError(
        destinationsLoading
          ? "Đang tải khu vực, vui lòng thử lại."
          : "Vui lòng chọn lại điểm đến.",
      );
    } else {
      setDestinationError(undefined);
    }

    if (!validStay || !selectedDestination) return;

    const guests = String(Number(staySearch.guests));

    saveDestinationSearch(selectedDestination, staySearch);

    const params = new URLSearchParams({
      checkIn: staySearch.checkIn,
      checkOut: staySearch.checkOut,
      guests,
    });

    setDestinationOpen(false);
    staySearch.setGuestsOpen(false);

    router.push(
      `${getDestinationPath(selectedDestination)}?${params.toString()}`,
    );
  }

  return {
    ...staySearch,

    destination,
    setDestination,
    destinationOpen,
    setDestinationOpen,

    history,
    selectHistory,
    clearHistory,

    errors,
    hasErrors: staySearch.hasErrors || Boolean(destinationError),
    clearError,
    handleSubmit,
  };
}
