"use client";

import { Modal } from "antd";

import type { RoomCommentType } from "@/features/rooms/types/comment.types";

import RoomReviewItem from "./RoomReviewItem";

type RoomReviewsModalProps = {
  open: boolean;
  comments: RoomCommentType[];
  onClose: () => void;
};

export default function RoomReviewsModal({
  open,
  comments,
  onClose,
}: RoomReviewsModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={720}
      footer={null}
      title={`Bình luận từ khách (${comments.length})`}
    >
      <div className="mt-4 max-h-[65dvh] overflow-y-auto pr-3">
        {comments.length > 0 ? (
          <div className="divide-y divide-border">
            {comments.map((review) => (
              <div key={review.id} className="py-6 first:pt-0 last:pb-0">
                <RoomReviewItem review={review} />
              </div>
            ))}
          </div>
        ) : (
          <p className="m-0! text-sm! leading-6! text-muted-foreground!">
            Chưa có bình luận cho chỗ ở này.
          </p>
        )}
      </div>
    </Modal>
  );
}
