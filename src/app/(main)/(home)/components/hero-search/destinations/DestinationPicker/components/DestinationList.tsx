"use client";

import type { DestinationType } from "../../../../../../../../features/destinations/types/destination.types";
import DestinationItem from "./DestinationItem";

type DestinationListProps = {
  destinations: DestinationType[];
  onSelect: (destination: DestinationType) => void;
};

export default function DestinationList({
  destinations,
  onSelect,
}: DestinationListProps) {
  if (destinations.length === 0) {
    return (
      <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
        Chưa có địa điểm.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-1">
      {destinations.map((destination) => (
        <DestinationItem
          key={destination.id}
          destination={destination}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
