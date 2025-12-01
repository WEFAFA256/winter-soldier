import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

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
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href="#" style={{ fontSize: '1.5rem', fontWeight: '700', color: scrolled ? 'var(--color-primary)' : 'var(--color-white)', fontFamily: 'var(--font-heading)' }}>
                    SERENITY SPA
                </a>
                <ul style={{ display: 'flex', gap: '2rem' }}>
                    {['Home', 'About', 'Services', 'Contact'].map((item) => (
                        <li key={item}>
                            <a
                                href={`#${item.toLowerCase()}`}
                                style={{
                                    color: scrolled ? 'var(--color-text)' : 'var(--color-white)',
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                }}
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
