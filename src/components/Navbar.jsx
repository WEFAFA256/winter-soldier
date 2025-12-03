import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
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

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Branches', path: '/branches' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/#contact' } // Keep contact as anchor or move to page? User said separate pages for About/Services. Contact usually stays or separate. I'll keep it as anchor on Home for now or just link to home bottom. Let's make it a separate page for consistency or just keep it simple. I'll point to /#contact for now.
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Determine if we are on the home page and not scrolled (transparent bg)
    const isTransparent = !scrolled && location.pathname === '/';

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
                    fontFamily: '"Times New Roman", Times, serif', // Added font family
                }}
            >
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.5rem', fontWeight: '700', color: isTransparent ? 'var(--color-white)' : 'var(--color-primary)', fontFamily: 'inherit', textDecoration: 'none' }}>
                        <img
                            src="/assets/logo.jpg"
                            alt="Serenity Spa Logo"
                            style={{
                                height: '50px',
                                width: '50px',
                                objectFit: 'contain',
                                borderRadius: '50%'
                            }}
                        />
                        THE SERENITY SPA
                    </Link>

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
                                        fontFamily: 'inherit', // Inherit Times New Roman
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
                        <img src="/assets/logo.jpg" alt="Serenity Spa Logo" className="sidebar-image" />
                    </div>
                    <div className="circular-text-container">
                        <svg viewBox="0 0 200 200" className="circular-text-svg">
                            <path id="circlePath" d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" fill="transparent" />
                            <text>
                                <textPath href="#circlePath" startOffset="50%" textAnchor="middle" className="circular-text-content">
                                    oasis of relaxation • oasis of relaxation •
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
