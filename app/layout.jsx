import '../src/index.css';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import SocialMediaIcons from '../src/components/SocialMediaIcons';
import ScrollToTop from '../src/components/ScrollToTop';
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  metadataBase: new URL('https://www.executiveserenityspa.com'),
  title: 'THE SERENITY SPA & MARINA STAYS-Luxury Oasis & Residences Entebbe',
  description: 'Experience premier wellness at Serenity Spa and luxury lakeside stays at The Marina Stays. Your sanctuary for relaxation and comfort in Uganda.',
  keywords: 'Spa Uganda, Serenity Spa, Serenity Spa Uganda, Serenity Spa & Executive, Serenity Spa and Executive Mobile Services, Executive Serenity Spa, Marina Stays, Uganda Spas, Spa Kampala, Wellness Entebbe, Luxury Hotel Uganda, Lake Victoria Stay, Mobile Massage Uganda',
  openGraph: {
    title: 'THE SERENITY SPA & MARINA STAYS',
    description: 'Your oasis of relaxation and premier residences in Entebbe.',
    url: 'https://www.executiveserenityspa.com',
    siteName: 'Serenity Spa & Marina Stays',
    images: [
      {
        url: '/assets/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'The Serenity Spa Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE SERENITY SPA & MARINA STAYS',
    description: 'Your oasis of relaxation and premier residences in Entebbe.',
    images: ['/assets/logo.jpg'],
  },
  icons: {
    icon: '/assets/logo.jpg', 
    shortcut: '/assets/logo.jpg',
    apple: '/assets/logo.jpg',
  },
  verification: {
    google: 'JnEdnVzzMOxxzLYSqskXnDYC-MeuPgsNzMOnftniCO4',
  },
};

import { BusinessProvider } from './BusinessContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/logo.jpg" />
        <link rel="apple-touch-icon" href="/assets/logo.jpg" />
        <meta property="og:image" content="/assets/logo.jpg" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R071KWF20B"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R071KWF20B');
          `
        }} />
      </head>
      <body>
        <BusinessProvider>
          <div className="App">
            <ScrollToTop />
            <Navbar />
            <main>{children}</main>
            <SocialMediaIcons />
            <Footer />
            <Analytics />
          </div>
        </BusinessProvider>
      </body>
    </html>
  );
}

