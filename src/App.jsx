import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DualHero from './components/DualHero';
import SpaPage from './components/SpaPage';
import HotelPage from './components/HotelPage';
import HotelRoomsPage from './components/HotelRoomsPage';
import Services from './components/Services';
import Branches from './components/Branches';
import Gallery from './components/Gallery';
import SocialMediaIcons from './components/SocialMediaIcons';
import Booking from './components/Booking';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const [homePageBusiness, setHomePageBusiness] = useState('spa');
  const location = useLocation();

  return (
    <div className="App">
      <ScrollToTop />
      <Navbar homePageBusiness={homePageBusiness} />
      <Routes>
        {/* Homepage with alternating spa/hotel content */}
        <Route path="/" element={<DualHero onBusinessChange={setHomePageBusiness} />} />

        {/* Spa Routes */}
        <Route path="/spa" element={<SpaPage />} />
        <Route path="/spa/services" element={
          <div style={{ marginTop: '80px' }}>
            <Services />
          </div>
        } />
        <Route path="/spa/gallery" element={<Gallery />} />
        <Route path="/spa/branches" element={<Branches />} />
        <Route path="/spa/booking" element={<Booking businessType="spa" />} />

        {/* Hotel Routes */}
        {/* Hotel Routes */}
        <Route path="/hotel" element={<HotelPage />} />
        <Route path="/hotel/rooms" element={<HotelRoomsPage />} />
        <Route path="/hotel/booking" element={<Booking businessType="hotel" />} />



        {/* Legacy routes (redirect to spa for backward compatibility) */}
        <Route path="/services" element={
          <div style={{ marginTop: '80px' }}>
            <Services />
          </div>
        } />
        <Route path="/branches" element={<Branches />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/booking" element={<Booking businessType="spa" />} />
      </Routes>

      <SocialMediaIcons mode={(location.pathname.startsWith('/hotel') || (location.pathname === '/' && homePageBusiness === 'hotel')) ? 'hotel' : 'spa'} />

      <Footer mode={(location.pathname.startsWith('/hotel') || (location.pathname === '/' && homePageBusiness === 'hotel')) ? 'hotel' : 'spa'} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

