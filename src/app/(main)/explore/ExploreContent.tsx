"use client";

import ExploreHero from "./components/ExploreHero";
import ExploreSearch from "./components/ExploreSearch";
import ExploreRoomGrid from "./components/ExploreRoomGrid";
import useExplore from "./hooks/useExplore";
import { useState } from "react";
import ExploreMapModal from "./components/ExploreMapModal";

export default function ExploreContent() {
  const [mapOpen, setMapOpen] = useState(false);
  const {
    destinations,
    destinationsLoading,
    destinationsError,
    retryDestinations,
    rooms,
    roomsLoading,
    roomsError,
    retryRooms,
    roomsRef,
    roomsVisible,
    destinationId,
    invalidDestinationId,
    selectedDestination,
    handleSelectDestination,
    heroTitle,
    heroImage,
    destinationOptions,
    resultsTitle,
    heroDescription,
  } = useExplore();

  return (
    <>
      <ExploreHero
        title={heroTitle}
        image={heroImage}
        selectedDestination={selectedDestination}
        options={destinationOptions}
        destinationId={destinationId}
        invalidDestinationId={invalidDestinationId}
        destinationsLoading={destinationsLoading}
        destinationsError={destinationsError}
        onRetryDestinations={retryDestinations}
        onSelectDestination={handleSelectDestination}
        description={heroDescription}
      />

      {/* Tìm theo ngày lưu trú và số khách. */}
      <ExploreSearch />

      {/* Chỉ tải danh sách phòng khi cuộn tới. */}
      <div ref={roomsRef} className="min-h-40 pt-10 sm:pt-14 lg:pt-20">
        {roomsVisible && (
          <ExploreRoomGrid
            rooms={rooms}
            destinations={destinations}
            title={resultsTitle}
            loading={roomsLoading}
            error={roomsError}
            invalidDestinationId={invalidDestinationId}
            destinationId={destinationId}
            onRetry={retryRooms}
            onShowAll={() => handleSelectDestination()}
            onViewMap={() => setMapOpen(true)}
          />
        )}
      </div>

      <ExploreMapModal
        open={mapOpen}
        onOpenChange={setMapOpen}
        destination={selectedDestination}
      />
    </>
  );
}
