import FooterCTA from "./FooterCTA";
import FooterContent from "./FooterContent";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-background text-foreground">
      <FooterCTA />
      <FooterContent />
    </footer>
  );
}
