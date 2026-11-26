"use client";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "amenities", label: "Tiện nghi" },
  { id: "policies", label: "Chính sách" },
] as const;

export type RoomDetailTab = (typeof tabs)[number]["id"];

type RoomDetailTabsProps = {
  activeTab: RoomDetailTab;
  contentId: string;
  onChange: (tab: RoomDetailTab) => void;
};

export default function RoomDetailTabs({
  activeTab,
  contentId,
  onChange,
}: RoomDetailTabsProps) {
  return (
    <div
      role="group"
      aria-label="Chọn nội dung thông tin chỗ ở"
      className="mb-6 flex overflow-x-auto border-b border-border"
    >
      {tabs.map(({ id, label }) => {
        const active = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            aria-controls={`${contentId}-${id}`}
            onClick={() => onChange(id)}
            className={[
              "group inline-flex shrink-0 cursor-pointer items-center justify-center px-5 py-4 text-sm font-semibold transition-colors duration-200 sm:px-6",
              "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
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
          </button>
        );
      })}
    </div>
  );
}
