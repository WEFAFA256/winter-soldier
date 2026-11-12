"use client";

import { useEffect } from "react";

const SCRIPTS = [
  "/assets/vendors/jquery/jquery-3.7.0.min.js",
  "/assets/vendors/bootstrap/js/bootstrap.bundle.min.js",
  "/assets/vendors/bootstrap-select/bootstrap-select.min.js",
  "/assets/vendors/jarallax/jarallax.min.js",
  "/assets/vendors/jquery-ui/jquery-ui.js",
  "/assets/vendors/jquery-ajaxchimp/jquery.ajaxchimp.min.js",
  "/assets/vendors/jquery-appear/jquery.appear.min.js",
  "/assets/vendors/jquery-circle-progress/jquery.circle-progress.min.js",
  "/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.min.js",
  "/assets/vendors/jquery-validate/jquery.validate.min.js",
  "/assets/vendors/nouislider/nouislider.min.js",
  "/assets/vendors/wnumb/wNumb.min.js",
  "/assets/vendors/owl-carousel/js/owl.carousel.min.js",
  "/assets/vendors/wow/wow.js",
  "/assets/vendors/imagesloaded/imagesloaded.min.js",
  "/assets/vendors/isotope/isotope.js",
  "/assets/vendors/countdown/countdown.min.js",
  "/assets/vendors/jquery-circleType/jquery.circleType.js",
  "/assets/vendors/jquery-lettering/jquery.lettering.min.js",
  "/assets/js/solox.js",
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => {
      console.warn(`Failed to load script: ${src}`);
      resolve();
    };
    document.body.appendChild(script);
  });
}

export default function SoloxScripts() {
  useEffect(() => {
    let isMounted = true;

    async function loadAll() {
      for (const src of SCRIPTS) {
        if (!isMounted) return;
        await loadScript(src);
      }

      // Hide preloader completely
      const preloader = document.querySelector(".preloader") as HTMLElement | null;
      if (preloader) {
        preloader.style.display = "none";
      }

      // Call soloxInitLoad
      const w = window as unknown as {
        soloxInitLoad?: () => void;
        jQuery?: ((sel: string | Window | Document) => { trigger: (e: string) => void }) & {
          fn?: Record<string, unknown>;
        };
      };

      if (typeof w.soloxInitLoad === "function") {
        try {
          w.soloxInitLoad();
        } catch (e) {
          console.warn("soloxInitLoad error:", e);
        }
      }
    }

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
