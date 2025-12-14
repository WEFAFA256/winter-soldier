import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ homePageBusiness = 'spa' }) => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Determine which business section we're in
    const isHotelSection = location.pathname.startsWith('/hotel');
    const isSpaSection = location.pathname.startsWith('/spa');
    const isHome = location.pathname === '/';

    // Dynamic branding based on section (or homepage business state)
    const branding = (isHome ? homePageBusiness === 'hotel' : isHotelSection) ? {
        logo: '/assets/hotel-logo.png',
        name: 'THE MARINA STAYS',
        color: '#8B4513',
        logoStyle: { height: '60px', width: 'auto', objectFit: 'contain', borderRadius: '10px' }
    } : {
        logo: '/assets/logo.jpg',
        name: 'THE SERENITY SPA',
        color: 'var(--color-primary)',
        logoStyle: { height: '50px', width: '50px', objectFit: 'contain', borderRadius: '50%' }
    };

    // Dynamic navigation links based on section
    const links = isHotelSection ? [
        { name: 'Home', path: '/' },
        { name: 'Hotel', path: '/hotel' },
        { name: 'Rooms', path: '/hotel#rooms' },
        { name: 'Book Stay', path: '/hotel/booking' },
        { name: 'Spa', path: '/spa' }
    ] : isSpaSection ? [
        { name: 'Home', path: '/' },
        { name: 'Spa', path: '/spa' },
        { name: 'Services', path: '/spa/services' },
        { name: 'Gallery', path: '/spa/gallery' },
        { name: 'Book Service', path: '/spa/booking' },
        { name: 'Hotel', path: '/hotel' }
    ] : [
        { name: 'Home', path: '/' },
        { name: 'Spa', path: '/spa' },
        { name: 'Hotel', path: '/hotel' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Determine if we are on the home page, hotel page, or spa page and not scrolled (transparent bg)
    // Only apply to the main landing pages where we have full-screen hero images
    const isTransparent = !scrolled && (location.pathname === '/' || location.pathname === '/hotel' || location.pathname === '/spa');

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    padding: '1.5rem 0',
                    transition: 'all 0.3s ease',
                    backgroundColor: isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
                    boxShadow: isTransparent ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
                    backdropFilter: isTransparent ? 'none' : 'blur(10px)',
                    fontFamily: '"Times New Roman", Times, serif',
                }}
            >
                <div className="container" style={{ display: 'flex', justifyContent: isHome ? 'flex-end' : 'space-between', alignItems: 'center' }}>
                    {!isHome && (
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.5rem', fontWeight: '700', color: isTransparent ? 'var(--color-white)' : branding.color, fontFamily: 'inherit', textDecoration: 'none' }}>
                            <img
                                src={branding.logo}
                                alt={branding.name}
                                style={branding.logoStyle}
                            />
                            {branding.name}
                        </Link>
                    )}

                    {/* Desktop Navigation */}
                    <ul className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
                        {links.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    style={{
                                        color: isTransparent ? 'var(--color-white)' : 'var(--color-text)',
                                        fontWeight: '500',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Hamburger Menu */}
                    <div
                        className={`hamburger-menu ${isTransparent ? 'light-bg' : 'dark-bg'}`}
                        onClick={toggleSidebar}
                    >
                        <span style={{ transform: sidebarOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
                        <span style={{ opacity: sidebarOpen ? 0 : 1 }}></span>
                        <span style={{ transform: sidebarOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button
                    className="sidebar-close-btn"
                    onClick={closeSidebar}
                >
                    &times;
                </button>

                {/* Sidebar Logo with Circular Text */}
                <div className="sidebar-logo-wrapper">
                    <div className="sidebar-image-container">
                        <img src={branding.logo} alt={branding.name} className="sidebar-image" />
                    </div>
                    <div className="circular-text-container">
                        <svg viewBox="0 0 200 200" className="circular-text-svg">
                            <path id="circlePath" d="M 100, 100 m -95, 0 a 95,95 0 1,1 190,0 a 95,95 0 1,1 -190,0" fill="transparent" />
                            <text>
                                <textPath href="#circlePath" startOffset="50%" textAnchor="middle" className="circular-text-content">
                                    {(isHome ? homePageBusiness === 'hotel' : isHotelSection) ? 'premier residences • premier residences •' : 'oasis of relaxation • oasis of relaxation •'}
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div>

                <div className="sidebar-separator"></div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', width: '100%' }}>
                    {links.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className="sidebar-link"
                                onClick={closeSidebar}
                                style={{ display: 'block', width: '100%' }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Navbar;

