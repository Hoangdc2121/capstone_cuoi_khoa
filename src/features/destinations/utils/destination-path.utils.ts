type DestinationPathInput = {
  id: number;
  tenViTri: string;
  tinhThanh: string;
};

export function getDestinationPath(destination: DestinationPathInput) {
  const slug = `${destination.tenViTri} ${destination.tinhThanh}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/explore/${slug}-${destination.id}`;
}