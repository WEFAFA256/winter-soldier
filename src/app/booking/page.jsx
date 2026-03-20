import Booking from '../../components/Booking';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Booking businessType="spa" />
      </main>
      <Footer mode="spa" />
    </>
  );
}
