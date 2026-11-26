// Tọa độ theo bố cục ảnh ghép mẫu 440 × 154.
export const mobileCollageTiles = [
  { viewBox: "0 0 217 154", className: "col-span-2 row-span-2" },
  { viewBox: "220 0 114 79", className: "" },
  { viewBox: "337 0 103 79", className: "" },
  { viewBox: "220 82 114 72", className: "" },
  { viewBox: "337 82 103 72", className: "" },
];

export function getRoomGalleryImages(
  image: string,
  images: readonly string[] = [],
): string[] {
  const urls = [image, ...images]
    .map((url) => url?.trim())
    .filter((url): url is string => Boolean(url));

  return [...new Set(urls)];
}