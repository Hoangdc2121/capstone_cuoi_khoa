import { notFound } from "next/navigation";

import RoomDetailContent from "./RoomDetailContent";

type RoomDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params;
  const roomId = Number(id);

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(roomId)) {
    notFound();
  }

  return <RoomDetailContent roomId={roomId} />;
}
