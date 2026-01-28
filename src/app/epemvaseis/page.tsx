import { Suspense } from "react";

import { EpemvaseisClient } from "./EpemvaseisClient";

export default function EpemvaseisPage() {
  return (
    <Suspense>
      <EpemvaseisClient />
    </Suspense>
  );
}
