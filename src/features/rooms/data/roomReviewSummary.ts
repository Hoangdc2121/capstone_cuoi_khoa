import {
  BadgeCheck,
  KeyRound,
  MapPin,
  MessageSquare,
  Sparkles,
  Tag,
} from "lucide-react";

// Phân bố sao mẫu, sẽ thay bằng dữ liệu bình luận từ API.
export const ratingDistribution = [
  { stars: 5, count: 96 },
  { stars: 4, count: 4 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

// Điểm tiêu chí mẫu.
export const categories = [
  {
    label: "Mức độ sạch sẽ",
    score: 4.9,
    icon: Sparkles,
  },
  {
    label: "Độ chính xác",
    score: 5,
    icon: BadgeCheck,
  },
  {
    label: "Nhận phòng",
    score: 4.9,
    icon: KeyRound,
  },
  {
    label: "Giao tiếp",
    score: 5,
    icon: MessageSquare,
  },
  {
    label: "Vị trí",
    score: 4.8,
    icon: MapPin,
  },
  {
    label: "Giá trị",
    score: 4.9,
    icon: Tag,
  },
];