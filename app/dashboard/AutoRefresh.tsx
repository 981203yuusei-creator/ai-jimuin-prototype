"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 60000;

export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      const active = document.activeElement;
      const isEditing =
        active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
      if (!isEditing) {
        router.refresh();
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}
