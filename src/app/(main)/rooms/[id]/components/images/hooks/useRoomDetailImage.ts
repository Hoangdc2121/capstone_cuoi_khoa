import { useState } from "react";
import { getRoomGalleryImages } from "../data/roomDetailImageData";


export default function useRoomDetailImage(
  image: string,
  images: readonly string[] = [],
) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const galleryImages = getRoomGalleryImages(image, images);

  return { previewOpen, setPreviewOpen, galleryImages };
}