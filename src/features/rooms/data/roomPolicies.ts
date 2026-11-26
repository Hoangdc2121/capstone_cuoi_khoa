import {
  CalendarDays,
  ClipboardList,
  DoorOpen,
  ShieldCheck,
} from "lucide-react";

// Nội dung mẫu dùng để dựng giao diện.
export const roomPolicies = [
  {
    id: "check-in",
    title: "Nhận và trả phòng",
    icon: DoorOpen,
    preview: [
      "Nhận phòng sau 14:00",
      "Trả phòng trước 12:00",
    ],
    details: [
      "Nhận phòng từ 14:00 và trả phòng trước 12:00.",
      "Thông báo trước cho chủ nhà về thời gian đến dự kiến.",
      "Nếu muốn nhận phòng sớm hoặc trả phòng muộn, vui lòng liên hệ chủ nhà để xác nhận.",
      "Kiểm tra đồ dùng cá nhân và bàn giao chìa khóa trước khi rời đi.",
    ],
  },
  {
    id: "house-rules",
    title: "Nội quy chỗ ở",
    icon: ClipboardList,
    preview: [
      "Không hút thuốc trong phòng",
      "Không tổ chức tiệc hoặc sự kiện",
    ],
    details: [
      "Không hút thuốc bên trong chỗ ở.",
      "Không tổ chức tiệc hoặc sự kiện khi chưa được chủ nhà đồng ý.",
      "Giữ yên tĩnh từ 22:00 đến 07:00.",
      "Sử dụng và giữ gìn các tiện nghi được cung cấp.",
      "Liên hệ chủ nhà trước nếu bạn muốn mang theo thú cưng.",
      "Không vượt quá số khách tối đa của phòng.",
    ],
  },
  {
    id: "cancellation",
    title: "Chính sách hủy",
    icon: CalendarDays,
    preview: [
      "Xem điều kiện hủy trước khi đặt",
      "Liên hệ hỗ trợ nếu cần thay đổi lịch",
    ],
    details: [
      "Kiểm tra điều kiện hủy và hoàn tiền được hiển thị trước khi xác nhận đặt phòng.",
      "Khả năng thay đổi ngày lưu trú phụ thuộc vào lịch trống của chỗ ở.",
      "Liên hệ chủ nhà hoặc bộ phận hỗ trợ nếu bạn cần thay đổi kế hoạch.",
      "Không mặc định mọi đặt phòng đều được hủy miễn phí.",
    ],
  },
  {
    id: "safety",
    title: "An toàn chỗ ở",
    icon: ShieldCheck,
    preview: [
      "Tìm hiểu lối thoát hiểm khi nhận phòng",
      "Kiểm tra thông tin thiết bị an toàn với chủ nhà",
    ],
    details: [
      "Xác định vị trí lối thoát hiểm khi đến chỗ ở.",
      "Hỏi chủ nhà về vị trí bình chữa cháy và bộ sơ cứu.",
      "Thông tin về máy báo khói và máy phát hiện khí CO chưa được xác nhận.",
      "Tắt các thiết bị điện không sử dụng và khóa cửa khi ra ngoài.",
      "Thông báo ngay cho chủ nhà nếu phát hiện thiết bị hỏng hoặc nguy cơ mất an toàn.",
    ],
  },
];