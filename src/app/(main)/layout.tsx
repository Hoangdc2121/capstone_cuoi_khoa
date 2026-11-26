import type { ReactNode } from "react";

import Header from "@/components/layout/headerLayout/Header";
import MobileBottomNav from "@/components/layout/client/mobile/MobileBottomNav";
import Footer from "@/components/layout/footerLayout/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div id="page-top">
      <Header />

      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
        <main>{children}</main>

        <Footer />
      </div>

      <MobileBottomNav />
    </div>
  );
}
