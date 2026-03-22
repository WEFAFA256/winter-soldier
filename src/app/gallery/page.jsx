import Gallery from '../../components/Gallery';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Gallery - Visual Sanctuary of Serenity Spa & Marina Stays',
  description: 'Glimpse the luxury of The Marina Stays and the tranquility of Serenity Spa through our high-definition gallery. See your next destination.',
  keywords: 'Hotel Gallery Entebbe, Spa Photos Kampala, Luxury Room Photos, Massage Studio Gallery',
  openGraph: {
    title: 'A Visual Sanctuary',
    description: 'Explore the ambiance of Entebbe\'s premier residences and our oasis of relaxation.',
  }
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Gallery />
      </main>
      <Footer mode="spa" />
    </>
  );
}
