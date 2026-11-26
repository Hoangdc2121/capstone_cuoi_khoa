import {
  BriefcaseBusiness,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  Music2,
  PawPrint,
} from "lucide-react";

import type { RoomCommentType } from "@/features/rooms/types/comment.types";



export const host = {
  reviews: "128",
  rating: "4,91",
  yearsHosting: "4",
  responseRate: "100%",
  responseTime: "Trong vòng 1 giờ",
  introduction:
    "Mình yêu du lịch, những căn nhà có cá tính và những câu chuyện được kể qua mỗi chuyến đi. Với mình, một chỗ ở thoải mái là khởi đầu cho một kỳ nghỉ đáng nhớ.\n\nMình thích khám phá quán cà phê nhỏ, thử món ăn địa phương và chia sẻ những địa điểm thú vị với khách. Nếu bạn cần gợi ý ăn uống hoặc lịch trình tham quan, mình rất vui được giúp bạn.",
};

export const hostFacts = [
  {
    icon: Lightbulb,
    text: "Sinh ra vào thập niên 90",
  },
  {
    icon: BriefcaseBusiness,
    text: "Công việc của tôi: Thiết kế không gian sống",
  },
  {
    icon: Music2,
    text: "Nhạc yêu thích: Acoustic và những bản nhạc du lịch",
  },
  {
    icon: Heart,
    text: "Điều tôi yêu thích: Một căn nhà ngập nắng và cây xanh",
  },
  {
    icon: PawPrint,
    text: "Thú cưng: Một chú mèo tên Mây",
  },
  {
    icon: Globe,
    text: "Ngôn ngữ: Tiếng Việt và tiếng Anh",
  },
  {
    icon: MapPin,
    text: "Sống tại: Thành phố Hồ Chí Minh",
  },
];

export type RoomHostCardProps = {
  description?: string | null;
  comments: RoomCommentType[];
};

export function getRoomHostInfo(description: RoomHostCardProps["description"]) {
  const hostMatch = description?.match(
    /^[ \t]*([^\r\n]+?)[ \t]+là[ \t]+Chủ nhà siêu cấp[.!]?[ \t]*\r?$/im,
  );

  const extractedHostName = hostMatch?.[1]?.trim();
  const hostName = extractedHostName || "Chủ nhà";

  const hostInitials = hostName
    .split(/\s+/)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("vi-VN");

  return { extractedHostName, hostName, hostInitials };
}