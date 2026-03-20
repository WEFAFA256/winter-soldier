import Branches from '../../components/Branches';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Branches />
      </main>
      <Footer mode="spa" />
    </>
  );
}
