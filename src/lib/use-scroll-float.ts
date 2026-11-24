"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrollFloat — repeating float-in animation triggered every time
 * an element scrolls into the viewport.
 *
 * Unlike usePageReveal (one-shot), this re-applies the CSS class each
 * time the element enters view and removes it when it leaves, so the
 * animation replays on every scroll-in.
 *
 * Returns:
 *   ref       — attach to the element's container
 *   floatClass — "" | "sf-in"  (apply to that element's className)
 */
export function useScrollFloat<T extends HTMLElement>(options?: {
  /** Stagger delay in seconds (default 0) */
  delay?: number;
  /** Fraction of the element that must be visible before triggering (default 0.1) */
  threshold?: number;
  /** Bottom rootMargin offset to trigger a bit earlier (default "-40px") */
  rootMargin?: string;
}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  const delay = options?.delay ?? 0;
  const threshold = options?.threshold ?? 0.1;
  const rootMargin = options?.rootMargin ?? "0px 0px -40px 0px";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          // Reset so the animation fires again next time it enters
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return {
    ref,
    floatClass: visible ? "sf-in" : "sf-out",
    style: { "--sf-delay": `${delay}s` } as React.CSSProperties,
  };
}
