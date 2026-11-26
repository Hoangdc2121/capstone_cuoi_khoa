import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
};

export default function BrandLogo({
  className,
  imageClassName,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Ở Đâu — Về trang chủ"
      className={cn(
        "inline-flex h-16 shrink-0 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <img
        src="/img/logo.png"
        alt="Ở Đâu"
        className={cn(
          "block h-full w-auto object-contain transition-transform duration-300 ease-out hover:scale-105 motion-reduce:transition-none",
          imageClassName,
        )}
      />
    </Link>
  );
}
