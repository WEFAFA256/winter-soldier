import type { Metadata } from "next";
import "./globals.css";
import FloatingContactButtons from "@/components/FloatingContactButtons";

export const metadata: Metadata = {
  title: "The Serenity Spa || Luxury Massage & Wellness Center",
  description:
    "The Serenity Spa is a premier luxury wellness center offering hydrotherapy, relaxing massages, and holistic treatments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />

        <link rel="stylesheet" href="/assets/vendors/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/vendors/bootstrap-select/bootstrap-select.min.css" />
        <link rel="stylesheet" href="/assets/vendors/animate/animate.min.css" />
        <link rel="stylesheet" href="/assets/vendors/fontawesome/css/all.min.css" />
        <link rel="stylesheet" href="/assets/vendors/jquery-ui/jquery-ui.css" />
        <link rel="stylesheet" href="/assets/vendors/jarallax/jarallax.css" />
        <link rel="stylesheet" href="/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.css" />
        <link rel="stylesheet" href="/assets/vendors/nouislider/nouislider.min.css" />
        <link rel="stylesheet" href="/assets/vendors/nouislider/nouislider.pips.css" />
        <link rel="stylesheet" href="/assets/vendors/tiny-slider/tiny-slider.css" />
        <link rel="stylesheet" href="/assets/vendors/solox-icons/style.css" />
        <link rel="stylesheet" href="/assets/vendors/owl-carousel/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/vendors/owl-carousel/css/owl.theme.default.min.css" />

        <link rel="stylesheet" href="/assets/css/solox.css" />
        <link rel="stylesheet" href="/assets/css/solox-dark.css" />
      </head>
      <body className="custom-cursor">
        {children}
        <FloatingContactButtons />

        {/* Vendor Scripts loaded in exact dependency order */}
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
      </body>
    </html>
  );
}
