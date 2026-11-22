"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot scroll reveal that never leaves content hidden.
 *
 * Elements are visible by default. Above-the-fold content that exists on the
 * first paint is left alone, avoiding the old refresh/blank-flash regression.
 * Offscreen elements get `.page-motion-in` once when they enter the viewport;
 * async catalogue cards can opt in to animating on mount because they do not
 * exist in the server-rendered HTML. The CSS keyframes always end visible.
 */
export function usePageReveal<T extends HTMLElement>(options?: {
  animateOnMount?: boolean;
}) {
  const animateOnMount = Boolean(options?.animateOnMount);
  const ref = useRef<T>(null);
  const [animate, setAnimate] = useState(animateOnMount);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight - 40 && rect.bottom > 0;

    if (alreadyVisible) {
      // First-paint sections stay static; async cards animate on mount.
      setAnimate(animateOnMount);
      if (animateOnMount) return;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateOnMount]);

  return { ref, className: animate ? "page-motion-in" : "" };
}
