import {
  Bath,
  BedDouble,
  DoorOpen,
  UsersRound,
} from "lucide-react";

import type { DestinationType } from "@/features/destinations/types/destination.types";

import type { RoomType } from "../types/room.types";

export default function getRoomOverview(
  room: RoomType,
  destinations: DestinationType[],
) {
  const destination = destinations.find(
    (item) => item.id === room.maViTri,
  );

  const locationLabel = destination
    ? `${destination.tenViTri}, ${destination.tinhThanh}`
    : undefined;

  const description = room.moTa?.trim();

  const roomStats = [
    {
      label: "Khách",
      value: room.khach,
      icon: UsersRound,
    },
    {
      label: "Phòng ngủ",
      value: room.phongNgu,
      icon: DoorOpen,
    },
    {
      label: "Giường",
      value: room.giuong,
      icon: BedDouble,
    },
    {
      label: "Phòng tắm",
      value: room.phongTam,
      icon: Bath,
    },
  ];

  return {
    locationLabel,
    description,
    roomStats,
  };
}