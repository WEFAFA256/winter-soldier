"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <style jsx global>{`
          html, body, *, *::before, *::after {
            cursor: auto !important;
          }
          .custom-cursor__cursor,
          .custom-cursor__cursor-two,
          .luxury-cursor__ring,
          .luxury-cursor__dot {
            display: none !important;
          }
        `}</style>
        {children}
      </>
    );
  }

  return (
    <>
      {children}

      <script src="/assets/vendors/jquery/jquery-3.7.0.min.js"></script>
      <script src="/assets/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/vendors/bootstrap-select/bootstrap-select.min.js"></script>
      <script src="/assets/vendors/jarallax/jarallax.min.js"></script>
      <script src="/assets/vendors/jquery-ui/jquery-ui.js"></script>
      <script src="/assets/vendors/jquery-ajaxchimp/jquery.ajaxchimp.min.js"></script>
      <script src="/assets/vendors/jquery-appear/jquery.appear.min.js"></script>
      <script src="/assets/vendors/jquery-circle-progress/jquery.circle-progress.min.js"></script>
      <script src="/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.min.js"></script>
      <script src="/assets/vendors/jquery-validate/jquery.validate.min.js"></script>
      <script src="/assets/vendors/nouislider/nouislider.min.js"></script>
      <script src="/assets/vendors/wnumb/wNumb.min.js"></script>
      <script src="/assets/vendors/owl-carousel/js/owl.carousel.min.js"></script>
      <script src="/assets/vendors/wow/wow.js"></script>
      <script src="/assets/vendors/imagesloaded/imagesloaded.min.js"></script>
      <script src="/assets/vendors/isotope/isotope.js"></script>
      <script src="/assets/vendors/countdown/countdown.min.js"></script>
      <script src="/assets/vendors/jquery-circleType/jquery.circleType.js"></script>
      <script src="/assets/vendors/jquery-lettering/jquery.lettering.min.js"></script>
      <script src="/assets/js/solox.js"></script>
    </>
  );
}
