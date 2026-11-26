export type MapBounds = [
  west: number,
  south: number,
  east: number,
  north: number,
];

// Khung nhìn tham khảo, không phải ranh giới hành chính.
export const DESTINATION_MAP_BOUNDS: Partial<Record<number, MapBounds>> = {
  // Quận 1, Hồ Chí Minh.
  1: [106.682, 10.754, 106.721, 10.801],

  // Cái Răng, Cần Thơ.
  2: [105.731, 9.963, 105.837, 10.035],

  // Tổng quan Nha Trang, chưa xác định riêng Hòn Rùa.
  3: [109.12, 12.15, 109.3, 12.35],

  // Hoàn Kiếm, Hà Nội.
  4: [105.837, 21.012, 105.869, 21.044],

  // Tổng quan Phú Quốc theo tinhThanh của API.
  5: [103.82, 9.95, 104.12, 10.48],

  // Hải Châu, Đà Nẵng.
  6: [108.19, 16.015, 108.235, 16.085],

  // Khu vực núi Langbiang.
  7: [108.415, 12.025, 108.465, 12.075],

  // Mũi Né, Phan Thiết.
  8: [108.24, 10.9, 108.33, 10.97],

  // Ba Đình, Hà Nội.
  18340: [105.8, 21.025, 105.85, 21.06],

  // Khu vực Quận 2, Hồ Chí Minh.
  25337: [106.715, 10.735, 106.815, 10.825],
};

export const VIETNAM_MAP_BOUNDS: MapBounds = [102, 8, 110, 24];