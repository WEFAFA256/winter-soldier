import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SpaLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer mode="spa" />
    </>
  );
}

