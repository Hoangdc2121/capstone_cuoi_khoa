"use client";

import useScrollReveal from "@/hooks/useScrollReveal";
import { useAppDispatch } from "@/redux/hooks";

import { createComment } from "../store/commentSlice";

import useRoomComments from "./useRoomComments";
import type { RoomReviewFormValues } from "./useRoomReviewForm";
import sortRoomComments from "../utils/sortRoomComments";

export default function useRoomReviewsSection(roomId: number) {
  const dispatch = useAppDispatch();

  const { ref, visible } = useScrollReveal({
    threshold: 0,
    rootMargin: "0px 0px -24px 0px",
  });

  const { comments, status, loading, error, retry } =
    useRoomComments(roomId, visible);

  const sortedComments = sortRoomComments(comments);

  async function handleSubmitReview(
    values: RoomReviewFormValues,
  ): Promise<void> {
    await dispatch(
      createComment({
        maPhong: roomId,
        noiDung: values.noiDung,
        saoBinhLuan: values.saoBinhLuan,
      }),
    ).unwrap();
  }

  return {
    ref,
    comments,
    sortedComments,
    loading,
    error,
    retry,
    showReviews: status === "succeeded" || comments.length > 0,
    handleSubmitReview,
  };
}