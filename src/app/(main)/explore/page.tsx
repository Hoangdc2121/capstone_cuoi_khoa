import { Suspense } from "react";

import ExploreContent from "./ExploreContent";

export default function ExplorePage() {
  return (
    <Suspense fallback={<p>Đang tải trang khám phá…</p>}>
      <ExploreContent />
    </Suspense>
  );
}
