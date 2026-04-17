import Booking from '../../components/Booking';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Book Your Oasis - Serenity Spa & Marina Stays',
  description: 'Easy online booking for luxury stays at The Marina Stays and premium wellness treatments at Serenity Spa. Secure your relaxation today.',
  keywords: 'Book Spa Kampala, Hotel Booking Entebbe, Luxury Suite Reservation, Wellness Booking Uganda',
  openGraph: {
    title: 'Book Your Relaxation & Stay',
    description: 'Premier residences and world-class spa services in Entebbe & Kampala.',
  }
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Booking />
      </main>
      <Footer mode="spa" />
    </>
  );
}

