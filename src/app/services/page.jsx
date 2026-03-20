import Services from '../../components/Services';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: '80px' }}>
        <Services />
      </main>
      <Footer mode="spa" />
    </>
  );
}
