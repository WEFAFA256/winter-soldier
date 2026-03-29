import '../src/index.css';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import SocialMediaIcons from '../src/components/SocialMediaIcons';
import ScrollToTop from '../src/components/ScrollToTop';

export const metadata = {
  title: 'The Serenity Spa & Marina Stays',
  description: 'Your Oasis of Relaxation and Premier Residences in Uganda',
};

import { BusinessProvider } from './BusinessContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
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
          </div>
        </BusinessProvider>
      </body>
    </html>
  );
}
