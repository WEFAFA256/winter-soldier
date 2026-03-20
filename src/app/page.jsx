'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DualHero from '../components/DualHero';
import Footer from '../components/Footer';

export default function Home() {
  const [homePageBusiness, setHomePageBusiness] = useState('spa');

  return (
    <div className="App">
      <Navbar homePageBusiness={homePageBusiness} />
      <main>
        <DualHero onBusinessChange={setHomePageBusiness} />
      </main>
      <Footer mode={homePageBusiness === 'hotel' ? 'hotel' : 'spa'} />
    </div>
  );
}
