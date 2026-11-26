export default function formatReviewDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa có thông tin ngày";
  }

  const now = new Date();
  const elapsed = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsed >= 0 && elapsed < day) {
    if (elapsed < minute) {
      return "Vừa xong";
    }

    if (elapsed < hour) {
      return `${Math.floor(elapsed / minute)} phút trước`;
    }

    return `${Math.floor(elapsed / hour)} giờ trước`;
  }

  const timeZone = "Asia/Ho_Chi_Minh";

  const yearFormatter = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    timeZone,
  });

  const sameYear =
    yearFormatter.format(date) === yearFormatter.format(now);

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone,
  }).format(date);
}