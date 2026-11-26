import type { DestinationType } from "../../../../../../../features/destinations/types/destination.types";

import DestinationCard from "./DestinationCard";

type DestinationGridProps = {
  destinations: DestinationType[];
};

const layouts = [
  "col-span-2",
  "lg:row-span-2",
  "",
  "",
  "lg:row-span-2",
  "lg:col-span-2",
  "",
  "",
  "lg:col-span-2",
  "",
];

export default function DestinationGrid({
  destinations,
}: DestinationGridProps) {
  // Sao chép để không thay đổi mảng dữ liệu truyền vào.
  const orderedDestinations = [...destinations];

  // Đặt ảnh tòa nhà Quận 1 vào ô dọc đầu tiên trên desktop.
  const hcmIndex = orderedDestinations.findIndex(
    (destination) => destination.id === 1,
  );

  if (hcmIndex !== -1 && orderedDestinations.length > 1) {
    const [hcmDestination] = orderedDestinations.splice(hcmIndex, 1);
    orderedDestinations.splice(1, 0, hcmDestination);
  }

  // Đặt ảnh Ba Đình vào ô dọc thứ hai trên desktop.
  const baDinhIndex = orderedDestinations.findIndex(
    (destination) => destination.id === 18340,
  );

  if (baDinhIndex !== -1 && orderedDestinations.length > 4) {
    [orderedDestinations[4], orderedDestinations[baDinhIndex]] = [
      orderedDestinations[baDinhIndex],
      orderedDestinations[4],
    ];
  }

  const visibleDestinations = orderedDestinations.slice(0, 10);

  // Ô đầu chiếm hai cột; nếu còn ô lẻ thì cho ô cuối phủ cả hàng.
  const expandLastCard =
    visibleDestinations.length > 1 && visibleDestinations.length % 2 === 0;

  return (
    <div className="grid auto-rows-45 grid-cols-2 gap-3 sm:auto-rows-52.5 lg:auto-rows-55 lg:grid-cols-3 lg:gap-4">
      {visibleDestinations.map((destination, index) => {
        const isExpandedLastCard =
          expandLastCard && index === visibleDestinations.length - 1;

        return (
          <DestinationCard
            key={destination.id}
            destination={destination}
            className={`h-full min-h-0 ${
              isExpandedLastCard
                ? "col-span-2 lg:col-span-1"
                : (layouts[index] ?? "")
            }`}
          />
        );
      })}
    </div>
  );
}
