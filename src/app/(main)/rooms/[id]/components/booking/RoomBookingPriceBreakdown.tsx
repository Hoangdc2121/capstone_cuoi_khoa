import {
  formatPrice,
  type RoomBookingPrice,
} from "@/features/rooms/hooks/getRoomBookingPrice";

type RoomBookingPriceBreakdownProps = {
  price: number;
  pricing: RoomBookingPrice;
};

export default function RoomBookingPriceBreakdown({
  price,
  pricing,
}: RoomBookingPriceBreakdownProps) {
  const { nights, subtotal, cleaningFee, serviceFee, discount } = pricing;
  const hasDates = nights > 0;

  return (
    <>
      <dl className="m-0! mt-4! space-y-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">
            {hasDates
              ? `${formatPrice(price)} USD × ${nights} đêm`
              : "Tiền phòng"}
          </dt>
          <dd className="m-0! shrink-0 font-medium">
            {hasDates ? `${formatPrice(subtotal)} USD` : "—"}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">
            Phí dọn dẹp
            <span className="mt-0.5 block text-xs">Một lần mỗi kỳ lưu trú</span>
          </dt>
          <dd className="m-0! shrink-0 font-medium">
            {hasDates ? `${formatPrice(cleaningFee)} USD` : "—"}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">
            Phí dịch vụ
            <span className="mt-0.5 block text-xs">5% tiền phòng</span>
          </dt>
          <dd className="m-0! shrink-0 font-medium">
            {hasDates ? `${formatPrice(serviceFee)} USD` : "—"}
          </dd>
        </div>

        {discount > 0 && (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">
              Ưu đãi ở dài ngày
              <span className="mt-0.5 block text-xs">
                Giảm 10% tiền phòng từ 7 đêm
              </span>
            </dt>
            <dd className="m-0! shrink-0 font-semibold text-primary">
              −{formatPrice(discount)} USD
            </dd>
          </div>
        )}
      </dl>

      {nights < 7 && (
        <p className="mb-0! mt-5! rounded-xl bg-accent px-3 py-2.5 text-xs! leading-5! text-accent-foreground!">
          Lưu trú từ 7 đêm để được giảm 10% tiền phòng.
        </p>
      )}
    </>
  );
}
