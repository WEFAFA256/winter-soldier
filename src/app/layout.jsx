import { Analytics } from "@vercel/analytics/next"
import '../index.css';
import '../App.css';
import '../animations.css';
import ScrollToTop from '../components/ScrollToTop';
import SocialMediaIcons from '../components/SocialMediaIcons';

export const metadata = {
  title: 'THE SERENITY SPA & MARINA STAYS-Luxury Oasis & Residences Entebbe',
  description: 'Experience premier wellness at Serenity Spa and luxury lakeside stays at The Marina Stays. Your sanctuary for relaxation and comfort in Uganda.',
  keywords: 'Spa Kampala, Wellness Entebbe, Luxury Hotel Uganda, Lake Victoria Stay, Serenity Spa, Marina Stays',
  openGraph: {
    title: 'THE SERENITY SPA & MARINA STAYS',
    description: 'Your oasis of relaxation and premier residences in Entebbe.',
    url: 'https://serenityspa-marina.com',
    siteName: 'Serenity Spa & Marina Stays',
    images: [
      {
        url: 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'The Marina Stays Luxury View',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE SERENITY SPA & MARINA STAYS',
    description: 'Your oasis of relaxation and premier residences in Entebbe.',
    images: ['https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-bg.jpg'],
  },
  icons: {
    icon: '/assets/logo.jpg', // Using existing logo as favicon fallback
    shortcut: '/assets/logo.jpg',
    apple: '/assets/logo.jpg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <a href="#main-content" className="skip-link" style={{ 
          position: 'absolute', 
          top: '-40px', 
          left: 0, 
          background: '#005C53', 
          color: 'white', 
          padding: '8px', 
          zIndex: 9999,
          transition: 'top 0.3s'
        }}>Skip to content</a>
        
        <div id="root">
          <ScrollToTop />
          <main id="main-content">
            {children}
          </main>
          <SocialMediaIcons />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
