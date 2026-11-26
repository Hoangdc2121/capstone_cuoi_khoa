import type { DateRangeValue } from "@/components/common/AppDatePicker";

const CLEANING_FEE = 10;
const SERVICE_FEE_RATE = 0.05;
const WEEKLY_DISCOUNT_RATE = 0.1;

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export default function getRoomBookingPrice(
  price: number,
  { checkIn, checkOut }: DateRangeValue,
) {
  const duration =
    checkIn && checkOut
      ? (Date.parse(`${checkOut}T00:00:00Z`) -
          Date.parse(`${checkIn}T00:00:00Z`)) /
        86_400_000
      : 0;

  const nights = Number.isInteger(duration) && duration > 0 ? duration : 0;
  const subtotal = roundMoney(price * nights);
  const cleaningFee = nights > 0 ? CLEANING_FEE : 0;
  const serviceFee = roundMoney(subtotal * SERVICE_FEE_RATE);
  const discount =
    nights >= 7 ? roundMoney(subtotal * WEEKLY_DISCOUNT_RATE) : 0;
  const total = roundMoney(subtotal + cleaningFee + serviceFee - discount);

  return { nights, subtotal, cleaningFee, serviceFee, discount, total };
}

export type RoomBookingPrice = ReturnType<typeof getRoomBookingPrice>;