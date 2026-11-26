import Link from "next/link";

type TripsFiltersProps = {
  tabs: readonly { id: string; label: string }[];
  activeStatus: string;
};

export default function TripsFilters({
  tabs,
  activeStatus,
}: TripsFiltersProps) {
  return (
    <nav
      aria-label="Lọc chuyến đi"
      className="flex overflow-x-auto border-b border-border"
    >
      {tabs.map(({ id, label }) => {
        const active = activeStatus === id;

        return (
          <Link
            key={id}
            href={`/trips?status=${encodeURIComponent(id)}`}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={[
              "group inline-flex shrink-0 items-center justify-center whitespace-nowrap px-5 py-4 text-sm font-semibold no-underline! transition-colors duration-200 sm:px-6",
              "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring",
              active
                ? "text-primary!"
                : "text-muted-foreground! hover:text-primary!",
            ].join(" ")}
          >
            <span
              className={[
                "animated-underline pb-1",
                "group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100",
                active ? "after:scale-x-100!" : "",
              ].join(" ")}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
