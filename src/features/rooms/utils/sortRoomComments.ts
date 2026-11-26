import type { RoomCommentType } from "../types/comment.types";

export default function sortRoomComments(
  comments: RoomCommentType[],
): RoomCommentType[] {
  return [...comments].sort((a, b) => {
    const dateA = Date.parse(a.ngayBinhLuan);
    const dateB = Date.parse(b.ngayBinhLuan);

    const timeA = Number.isNaN(dateA) ? 0 : dateA;
    const timeB = Number.isNaN(dateB) ? 0 : dateB;

    // Mới nhất trước; cùng thời điểm thì ID lớn hơn trước.
    return timeB - timeA || b.id - a.id;
  });
}