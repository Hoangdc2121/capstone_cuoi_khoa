"use client";

import { useId, useState } from "react";

import type { RoomCommentType } from "../types/comment.types";
import useTextOverflow from "./useTextOverflow";

export default function useRoomReviewItem(review: RoomCommentType) {
  const contentId = useId();

  const [expanded, setExpanded] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);

  const name = review.tenNguoiBinhLuan?.trim() || "Người dùng";
  const avatar = review.avatar?.trim();
  const content = review.noiDung?.trim();

  const { ref: contentRef, overflowing: canExpand } =
    useTextOverflow(content, 3);

  const initials = name
    .split(/\s+/)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("vi-VN");

  const validRating =
    Number.isInteger(review.saoBinhLuan) &&
    review.saoBinhLuan >= 1 &&
    review.saoBinhLuan <= 5;

  const showAvatar = Boolean(avatar && failedAvatar !== avatar);

  function handleAvatarError() {
    if (avatar) {
      setFailedAvatar(avatar);
    }
  }

  function toggleExpanded() {
    setExpanded((previous) => !previous);
  }

  return {
    contentId,
    contentRef,
    expanded,
    canExpand,
    name,
    avatar,
    content,
    initials,
    validRating,
    showAvatar,
    handleAvatarError,
    toggleExpanded,
  };
}