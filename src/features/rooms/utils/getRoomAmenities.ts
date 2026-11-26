import {
  BedDouble,
  Car,
  CookingPot,
  DoorClosed,
  Droplets,
  Layers,
  RectangleHorizontal,
  Refrigerator,
  Shirt,
  ShowerHead,
  SprayCan,
  TestTube,
  Tv,
  Utensils,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { RoomType } from "../types/room.types";

type Amenity = {
  id: string;
  label: string;
  icon: LucideIcon;
  available: boolean;
};

type AmenityGroup = {
  title: string;
  items: Amenity[];
};

export default function getRoomAmenities(room: RoomType) {
  // Tiện nghi lấy từ API.
  const apiAmenities: Amenity[] = [
    {
      id: "wifi",
      label: "Wifi",
      icon: Wifi,
      available: room.wifi,
    },
    {
      id: "tv",
      label: "Tivi",
      icon: Tv,
      available: room.tivi,
    },
    {
      id: "air-conditioning",
      label: "Điều hòa",
      icon: Wind,
      available: room.dieuHoa,
    },
    {
      id: "kitchen",
      label: "Bếp",
      icon: CookingPot,
      available: room.bep,
    },
    {
      id: "washing-machine",
      label: "Máy giặt",
      icon: WashingMachine,
      available: room.mayGiat,
    },
    {
      id: "iron",
      label: "Bàn ủi",
      icon: Shirt,
      available: room.banLa || room.banUi,
    },
    {
      id: "parking",
      label: "Chỗ đỗ xe",
      icon: Car,
      available: room.doXe,
    },
    {
      id: "pool",
      label: "Hồ bơi",
      icon: Waves,
      available: room.hoBoi,
    },
  ];

  // Tiện nghi bổ sung chưa có trường trong API.
  const additionalGroups: AmenityGroup[] = [
    {
      title: "Phòng tắm",
      items: [
        {
          id: "shower",
          label: "Vòi sen",
          icon: ShowerHead,
          available: true,
        },
        {
          id: "hot-water",
          label: "Nước nóng",
          icon: Droplets,
          available: true,
        },
        {
          id: "towels",
          label: "Khăn tắm",
          icon: RectangleHorizontal,
          available: true,
        },
        {
          id: "shampoo",
          label: "Dầu gội đầu",
          icon: TestTube,
          available: true,
        },
        {
          id: "body-wash",
          label: "Sữa tắm",
          icon: SprayCan,
          available: true,
        },
      ],
    },
    {
      title: "Phòng ngủ",
      items: [
        {
          id: "bed-linen",
          label: "Chăn ga và gối",
          icon: BedDouble,
          available: true,
        },
        {
          id: "extra-blanket",
          label: "Chăn dự phòng",
          icon: Layers,
          available: true,
        },
        {
          id: "wardrobe",
          label: "Tủ quần áo",
          icon: DoorClosed,
          available: true,
        },
      ],
    },
    {
      title: "Đồ dùng ăn uống",
      items: [
        {
          id: "refrigerator",
          label: "Tủ lạnh",
          icon: Refrigerator,
          available: true,
        },
        {
          id: "tableware",
          label: "Bát đĩa và dụng cụ ăn uống",
          icon: Utensils,
          available: true,
        },
        {
          id: "cookware",
          label: "Nồi và chảo",
          icon: UtensilsCrossed,
          available: true,
        },
      ],
    },
  ];

  const groups = [
    {
      title: "Tiện nghi tại chỗ ở",
      items: apiAmenities,
    },
    ...additionalGroups,
  ]
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.available),
    }))
    .filter((group) => group.items.length > 0);

  const allAmenities = groups.flatMap((group) => group.items);

  const previewAmenities = allAmenities.slice(0, 10);

  return {
    groups,
    allAmenities,
    previewAmenities,
  };
}
