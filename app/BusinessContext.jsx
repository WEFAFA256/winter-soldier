'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessMode, setBusinessMode] = useState('spa');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/hotel')) {
      setBusinessMode('hotel');
    } else if (pathname.startsWith('/spa')) {
      setBusinessMode('spa');
    }
    // For '/', the current mode will be set by DualHero via the context
  }, [pathname]);

  return (
    <BusinessContext.Provider value={{ businessMode, setBusinessMode }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
