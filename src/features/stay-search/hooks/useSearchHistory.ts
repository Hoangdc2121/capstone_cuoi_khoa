"use client";

import { useEffect, useState } from "react";

export type SearchHistoryItem = {
  destinationId: number;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
};

type SearchDestination = {
  id: number;
  tenViTri: string;
  tinhThanh: string;
};

type SearchStay = {
  checkIn: string;
  checkOut: string;
  guests: string;
};

const STORAGE_KEY = "o-dau:search-history";
const MAX_HISTORY = 5;

function isSearchHistoryItem(value: unknown): value is SearchHistoryItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.destinationId === "number" &&
    Number.isSafeInteger(item.destinationId) &&
    item.destinationId > 0 &&
    typeof item.destination === "string" &&
    typeof item.checkIn === "string" &&
    typeof item.checkOut === "string" &&
    typeof item.guests === "string"
  );
}

function readHistory(): SearchHistoryItem[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(stored)
      ? stored.filter(isSearchHistoryItem).slice(0, MAX_HISTORY)
      : [];
  } catch {
    return [];
  }
}

function writeHistory(items: SearchHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Tìm kiếm vẫn hoạt động nếu trình duyệt không cho lưu dữ liệu.
  }
}

export default function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  function saveSearch(item: SearchHistoryItem) {
    const previous = readHistory();

    const next = [
      item,
      ...previous.filter(
        (entry) =>
          entry.destinationId !== item.destinationId ||
          entry.checkIn !== item.checkIn ||
          entry.checkOut !== item.checkOut ||
          entry.guests !== item.guests,
      ),
    ].slice(0, MAX_HISTORY);

    writeHistory(next);
    setHistory(next);
  }

  function saveDestinationSearch(
    destination: SearchDestination,
    stay: SearchStay,
  ) {
    saveSearch({
      destinationId: destination.id,
      destination: `${destination.tenViTri}, ${destination.tinhThanh}`,
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      guests: String(Number(stay.guests)),
    });
  }

  function clearHistory() {
    writeHistory([]);
    setHistory([]);
  }

  return {
    history,
    saveSearch,
    saveDestinationSearch,
    clearHistory,
  };
}