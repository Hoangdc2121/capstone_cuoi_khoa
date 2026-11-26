"use client";

import { Modal } from "antd";

import AppButton from "@/components/common/AppButton";
import type { RoomBookingConfirmModalProps } from "@/features/booking/types/booking.types";
import { formatPrice } from "@/features/rooms/hooks/getRoomBookingPrice";

function formatBookingDate(value: string) {
  return value.split("-").reverse().join("/");
}

export default function RoomBookingConfirmModal({
  open,
  roomName,
  checkIn,
  checkOut,
  nights,
  guests,
  total,
  submitting = false,
  error,
  onClose,
  onConfirm,
}: RoomBookingConfirmModalProps) {
  return (
    <Modal
      open={open}
      title="Xác nhận đặt phòng"
      centered
      width={480}
      closable={!submitting}
      keyboard={!submitting}
      onCancel={() => {
        if (!submitting) onClose();
      }}
      footer={
        <div className="grid gap-2 sm:flex sm:justify-end">
          <AppButton
            type="default"
            htmlType="button"
            disabled={submitting}
            onClick={onClose}
            className="h-11! rounded-xl!"
          >
            Quay lại chỉnh sửa
          </AppButton>

          <AppButton
            type="primary"
            htmlType="button"
            loading={submitting}
            disabled={submitting || !onConfirm}
            onClick={onConfirm}
            className="h-11! rounded-xl! font-semibold!"
          >
            {submitting ? "Đang đặt phòng…" : "Xác nhận đặt phòng"}
          </AppButton>
        </div>
      }
    >
      <div className="py-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="m-0! font-heading text-base! font-semibold! text-foreground!">
            {roomName}
          </p>

          <dl className="m-0! mt-4! grid grid-cols-2 gap-3">
            <div>
              <dt className="text-xs text-muted-foreground">Nhận phòng</dt>
              <dd className="m-0! mt-1! font-medium text-foreground">
                {formatBookingDate(checkIn)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-muted-foreground">Trả phòng</dt>
              <dd className="m-0! mt-1! font-medium text-foreground">
                {formatBookingDate(checkOut)}
              </dd>
            </div>
          </dl>

          <p className="mb-0! mt-3! text-sm! text-muted-foreground!">
            {nights} đêm · {guests} khách
          </p>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
            <span className="font-medium text-foreground">
              Tổng tiền dự kiến
            </span>
            <strong className="text-lg text-foreground">
              {formatPrice(total)} USD
            </strong>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-0! mt-3! rounded-xl bg-destructive/10 px-3 py-2 text-sm! text-destructive!"
          >
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
