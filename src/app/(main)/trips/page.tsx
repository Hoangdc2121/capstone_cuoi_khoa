import TripsContent from "./TripsContent";
import { TRIPS_HERO_IMAGE, TRIP_TABS } from "./constants/trips";
import { getTripsPageData } from "./server/getTripsPageData";

type TripsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const { status } = await searchParams;
  const activeTab = TRIP_TABS.find((tab) => tab.id === status) ?? TRIP_TABS[0];
  const { isSignedIn, hasLoadError, bookings, roomsById } =
    await getTripsPageData(activeTab.id);

  return (
    <TripsContent
      imageSrc={TRIPS_HERO_IMAGE}
      isSignedIn={isSignedIn}
      hasLoadError={hasLoadError}
      tabs={TRIP_TABS}
      activeTab={activeTab}
      bookings={bookings}
      roomsById={roomsById}
    />
  );
}
