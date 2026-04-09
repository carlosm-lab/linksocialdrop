"use client";

import { useEffect } from "react";
import { recordPageView } from "@/actions/analytics";

export function PageViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    // Only fire once in strict mode using a quick check or just let it fire (minor double count in dev is fine)
    const fireView = async () => {
      await recordPageView({
        profile_id: profileId,
        referrer: document.referrer,
      });
    };

    // Slight delay to not block rendering
    const timer = setTimeout(fireView, 1000);
    return () => clearTimeout(timer);
  }, [profileId]);

  return null;
}
