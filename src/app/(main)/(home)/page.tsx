import HeroSearch from "./components/hero-search/HeroSearch";
import HeroSection from "./components/hero-background/HeroSection";
import DestinationSection from "./components/hero-search/destination-section/DestinationSection";
import SuggestedRoomsSection from "./components/suggested-rooms/SuggestedRoomsSection";

export default function Home() {
  return (
    <main>
      <HeroSection>
        <HeroSearch />
      </HeroSection>

      <DestinationSection />
      <SuggestedRoomsSection />
    </main>
  );
}
