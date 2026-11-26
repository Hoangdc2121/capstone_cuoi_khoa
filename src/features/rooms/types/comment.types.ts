export type CommentType = {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
};

export type CommentPayload = Omit<CommentType, "id">;

// Dữ liệu GET bình luận theo phòng.
export type RoomCommentType = Pick<
  CommentType,
  "id" | "ngayBinhLuan" | "noiDung" | "saoBinhLuan"
> & {
  tenNguoiBinhLuan: string;
  avatar: string | null;
};
