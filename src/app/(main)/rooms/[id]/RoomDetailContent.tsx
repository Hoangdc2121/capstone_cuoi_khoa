"use client";

import AppButton from "@/components/common/AppButton";
import Container from "@/components/common/Container";
import useRoomDetail from "@/features/rooms/hooks/useRoomDetail";

import RoomDetailBody from "./components/RoomDetailBody";
import RoomDetailImage from "./components/images/RoomDetailImage";

type RoomDetailContentProps = {
  roomId: number;
};

export default function RoomDetailContent({ roomId }: RoomDetailContentProps) {
  const { room, loading, error, invalidRoomId, retry } = useRoomDetail(roomId);
  const heroRoom = !loading && !error ? room : null;

  return (
    <div className="w-full min-w-0 overflow-x-clip">
      {heroRoom && (
        <div className="relative">
          <RoomDetailImage image={heroRoom.hinhAnh} name={heroRoom.tenPhong} />
        </div>
      )}

      <Container>
        <div
          className={
            heroRoom ? "pb-12 sm:pb-16" : "pb-12 pt-28 sm:pb-16 sm:pt-32"
          }
        >
          {loading ? (
            <div role="status" aria-busy="true" className="mt-6">
              <span className="sr-only">Đang tải chi tiết phòng…</span>

              <div
                aria-hidden="true"
                className="animate-pulse motion-reduce:animate-none"
              >
                <div className="aspect-video rounded-3xl bg-muted" />

                <div className="mt-8 h-8 w-3/4 rounded-lg bg-muted" />

                <div className="mt-4 h-5 w-1/2 rounded bg-muted" />

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="h-20 rounded-2xl bg-muted" />
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h1 className="m-0! font-heading text-xl! font-semibold! text-foreground!">
                Không thể hiển thị chỗ ở
              </h1>

              <p
                role="alert"
                className="mb-0! mt-3! text-sm! leading-6! text-destructive!"
              >
                {error}
              </p>

              {!invalidRoomId && (
                <AppButton htmlType="button" onClick={retry} className="mt-5">
                  Thử lại
                </AppButton>
              )}
            </div>
          ) : heroRoom ? (
            <RoomDetailBody room={heroRoom} />
          ) : (
            <p
              role="status"
              className="mb-0! mt-6! text-sm! text-muted-foreground!"
            >
              Không có dữ liệu phòng.
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
