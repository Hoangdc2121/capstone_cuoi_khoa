import "server-only";

import { API_CONFIG } from "@/config/api.config";
import { apiFetch, type ApiResponse } from "@/lib/api-fetch";

import type { BookingPayload, BookingType } from "../types/booking.types";

export const BookingService = {
  getAll() {
    return apiFetch<ApiResponse<BookingType[]>>(
      API_CONFIG.ENPOINTS.Booking.GET_ALL,
      { method: "GET" },
    );
  },

  getById(bookingId: number) {
    return apiFetch<ApiResponse<BookingType>>(
      API_CONFIG.ENPOINTS.Booking.GET_BY_BOOKING(bookingId),
      { method: "GET" },
    );
  },

  getByUser(userId: number) {
    return apiFetch<ApiResponse<BookingType[]>>(
      API_CONFIG.ENPOINTS.Booking.GET_BY_USER(userId),
      { method: "GET" },
    );
  },

  create(data: BookingPayload) {
    return apiFetch<ApiResponse<unknown>>(
      API_CONFIG.ENPOINTS.Booking.CREATE,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({ ...data, id: 0 }),
      },
    );
  },

  update(bookingId: number, data: BookingPayload) {
    return apiFetch<ApiResponse<unknown>>(
      API_CONFIG.ENPOINTS.Booking.UPDATE(bookingId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({ ...data, id: bookingId }),
      },
    );
  },

  delete(bookingId: number) {
    return apiFetch<ApiResponse<unknown>>(
      API_CONFIG.ENPOINTS.Booking.DELETE(bookingId),
      { method: "DELETE" },
    );
  },
};