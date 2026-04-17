import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function HotelLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer mode="hotel" />
    </>
  );
}

