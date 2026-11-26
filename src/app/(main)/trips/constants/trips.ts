export const TRIPS_HERO_IMAGE = "/img/trips_hero_vietnam.png";

export const TRIP_TABS = [
  { id: "upcoming", label: "Sắp tới" },
  { id: "current", label: "Đang lưu trú" },
  { id: "past", label: "Đã qua" },
] as const;

export type TripStatus = (typeof TRIP_TABS)[number]["id"];