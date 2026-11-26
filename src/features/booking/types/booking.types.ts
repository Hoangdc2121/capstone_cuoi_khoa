export type BookingType = {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
};

export type BookingPayload = Omit<BookingType, "id">;

export type RoomBookingConfirmModalProps = {
  open: boolean;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  submitting?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
};