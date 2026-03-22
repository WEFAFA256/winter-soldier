import { Analytics } from "@vercel/analytics/next"
import '../index.css';
import '../App.css';
import '../animations.css';
import ScrollToTop from '../components/ScrollToTop';
import SocialMediaIcons from '../components/SocialMediaIcons';

export const metadata = {
  title: 'THE SERENITY SPA & MARINA STAYS',
  description: 'Your oasis of relaxation and premier residences.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          <ScrollToTop />
          {children}
          <SocialMediaIcons />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
