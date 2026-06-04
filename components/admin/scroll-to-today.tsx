"use client";

import { useEffect } from "react";

/**
 * On mount, scrolls the page so the element with `targetId` (the next
 * upcoming reservation / event) sits just below the sticky nav + filter bar.
 * Runs once on load — not on filter changes, since the tree persists.
 */
export function ScrollToToday({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const nav = document.querySelector("header.sticky") as HTMLElement | null;
    const filters = document.getElementById("admin-filters");
    const offset =
      (nav?.offsetHeight ?? 0) + (filters?.offsetHeight ?? 0) + 16;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [targetId]);

  return null;
}
