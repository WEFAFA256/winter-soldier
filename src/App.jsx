import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Branches from './components/Branches';
import Gallery from './components/Gallery';
import SocialMediaIcons from './components/SocialMediaIcons';
import PriceList from './components/PriceList';
import Booking from './components/Booking';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <PriceList />
              <Contact />
              <SocialMediaIcons />
            </>
          } />
          <Route path="/about" element={
            <div style={{ marginTop: '80px' }}>
              <About />
            </div>
          } />
          <Route path="/services" element={
            <div style={{ marginTop: '80px' }}>
              <Services />
            </div>
          } />
          <Route path="/branches" element={<Branches />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', padding: '2rem 0', textAlign: 'center' }}>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Serenity Spa. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
