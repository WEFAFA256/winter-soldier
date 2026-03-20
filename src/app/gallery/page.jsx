import Gallery from '../../components/Gallery';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
