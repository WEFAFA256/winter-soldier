import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Services from './Services';
import Gallery from './Gallery';
import Contact from './Contact';
import PriceList from './PriceList';

const SpaPage = () => {
    // Slideshow State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Images Array - New image first, then original
    const images = [
        '/assets/spa-hero-bg-2.jpg',
        '/assets/spa-hero-bg.jpg'
    ];

    // Cycle images every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div>
            {/* Spa Hero Section */}
            <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                {/* Background Slideshow */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <style>
                        {`
                            .hero-bg-image {
                                width: 100%;
                                height: auto;
                                display: block;
                                min-height: 600px;
                                object-fit: cover;
                                animation: zoomIn 7s ease-out forwards;
                                backface-visibility: hidden;
                                transform: translateZ(0);
                                image-rendering: high-quality;
                            }
                            
                            @keyframes zoomIn {
                                0% { transform: scale(1); }
                                100% { transform: scale(1.1); }
                            }
                        `}
                    </style>

                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '30%',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                        zIndex: 1
                    }}></div>

                    {/* Render current image with key to trigger animation */}
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt="The Serenity Spa"
                            className="hero-bg-image"
                        />
                    </div>
                </div>

                {/* Content Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start', // Fixed top position
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        zIndex: 2,
                        paddingTop: 'clamp(100px, 22vh, 200px)' // Consistent spacing (lowered)
                    }}
                >
                    <div className="container">
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1rem',
                            fontFamily: '"Times New Roman", Times, serif',
                            color: '#005C53' // Deep Teal Green
                        }}>
                            THE SERENITY SPA
                        </h1>
                        <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                            Your Oasis of Relaxation
                        </p>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            📍 Makerere, Kampala
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link
                                to="/spa/booking"
                                style={{
                                    padding: '1rem 2.5rem',
                                    backgroundColor: '#ffffff',
                                    color: 'var(--color-primary)',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Book Spa Service
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Price List */}
            <PriceList />

            {/* Contact */}
            <Contact />
        </div>
    );
};

export default SpaPage;
