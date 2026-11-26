"use client";

import { useId, useState } from "react";

import useScrollReveal from "@/hooks/useScrollReveal";
import type { RoomCommentType } from "../types/comment.types";

const PREVIEW_LIMIT = 6;

export default function useRoomReviews(comments: RoomCommentType[]) {
  const titleId = useId();
  const [allReviewsOpen, setAllReviewsOpen] = useState(false);

  const { ref, visible } = useScrollReveal<HTMLElement>({
    threshold: 0,
    rootMargin: "0px 0px -24px 0px",
    once: true,
  });

  const reviewCount = comments.length;
  const previewComments = comments.slice(0, PREVIEW_LIMIT);

  function openAllReviews() {
    setAllReviewsOpen(true);
  }

  function closeAllReviews() {
    setAllReviewsOpen(false);
  }

  return {
    ref,
    visible,
    titleId,
    reviewCount,
    previewComments,
    hasComments: reviewCount > 0,
    hasMoreComments: reviewCount > PREVIEW_LIMIT,
    allReviewsOpen,
    openAllReviews,
    closeAllReviews,
  };
}