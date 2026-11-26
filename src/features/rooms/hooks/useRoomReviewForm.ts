"use client";

import { useRef, useState, type FormEvent } from "react";

import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "@/utils/notification";

export type RoomReviewFormValues = {
  noiDung: string;
  saoBinhLuan: number;
};

type FormErrors = {
  rating?: string;
  content?: string;
};

type SubmitReview = (values: RoomReviewFormValues) => Promise<void>;

export default function useRoomReviewForm(onSubmit: SubmitReview) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Chặn gửi trùng ngay cả trước khi React render lại.
  const submittingRef = useRef(false);

  function handleRatingChange(value: number) {
    setRating(value);

    setErrors((previous) => ({
      ...previous,
      rating: undefined,
    }));
  }

  function handleContentChange(value: string) {
    setContent(value);

    setErrors((previous) => ({
      ...previous,
      content: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    const trimmedContent = content.trim();
    const nextErrors: FormErrors = {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      nextErrors.rating = "Vui lòng chọn số sao đánh giá.";
    }

    if (!trimmedContent) {
      nextErrors.content = "Vui lòng nhập nội dung bình luận.";
    } else if (trimmedContent.length > 2000) {
      nextErrors.content = "Nội dung không được vượt quá 2000 ký tự.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await onSubmit({
        noiDung: trimmedContent,
        saoBinhLuan: rating,
      });

      setRating(0);
      setContent("");
      setErrors({});

      notifySuccess("Gửi bình luận thành công!");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Không thể gửi bình luận. Vui lòng thử lại.";

      if (message === "Vui lòng đăng nhập để gửi bình luận.") {
        notifyWarning(message);
      } else {
        notifyError(message);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return {
    rating,
    content,
    submitting,
    errors,
    handleRatingChange,
    handleContentChange,
    handleSubmit,
  };
}