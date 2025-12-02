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

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                padding: '1.5rem 0',
                transition: 'all 0.3s ease',
                backgroundColor: scrolled || location.pathname !== '/' ? 'rgba(255, 255, 255, 0.95)' : 'transparent', // Always solid on other pages
                boxShadow: scrolled || location.pathname !== '/' ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                backdropFilter: scrolled || location.pathname !== '/' ? 'blur(10px)' : 'none',
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.5rem', fontWeight: '700', color: scrolled || location.pathname !== '/' ? 'var(--color-primary)' : 'var(--color-white)', fontFamily: 'var(--font-heading)', textDecoration: 'none' }}>
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
                    SERENITY SPA
                </Link>
                <ul style={{ display: 'flex', gap: '2rem' }}>
                    {links.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                style={{
                                    color: scrolled || location.pathname !== '/' ? 'var(--color-text)' : 'var(--color-white)',
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
