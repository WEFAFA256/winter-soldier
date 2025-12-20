import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Services from './Services';
import Gallery from './Gallery';
import Contact from './Contact';
import PriceList from './PriceList';
import { useScrollReveal } from '../hooks/useAnimations';

import Reviews from './Reviews';

const SpaPage = () => {
    // Slideshow State
    const originalImages = [
        '/assets/spa-hero-bg-2.jpg',
        '/assets/spa-hero-bg.jpg',
        '/assets/spa-new-1.jpg',
        '/assets/spa-new-2.jpg'
    ];
    // Clone first image for seamless loop
    const extendedImages = [...originalImages, originalImages[0]];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Initial mount effect
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cycle images every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => prev + 1);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Handle Seamless Loop Reset
    useEffect(() => {
        if (currentIndex === originalImages.length) {
            // Reached clone. Wait 1s transition, then snap reset.
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 1000);
            return () => clearTimeout(timeout);
        } else if (currentIndex === 0 && !isTransitioning) {
            // Snapped back. Re-enable transition.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true);
                });
            });
        }
    }, [currentIndex, isTransitioning, originalImages.length]);

    // Initialize scroll reveal animations
    useScrollReveal();

    return (
        <div>
            {/* Spa Hero Section */}
            <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                {/* Background Slideshow */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <style>
                        {`
                            /* Slider Styles */
                            .hero-slider-track {
                                display: flex;
                                width: 100%;
                            }

                            @keyframes zoomSlow {
                                from { transform: scale(1); }
                                to { transform: scale(1.1); }
                            }
                            
                            .hero-bg-image {
                                width: 100%;
                                min-width: 100%;
                                flex-shrink: 0;
                                height: 100%; 
                                display: block;
                                min-height: 600px;
                                object-fit: contain; /* Show all details */
                                backface-visibility: hidden;
                                transform: scale(1);
                                image-rendering: high-quality;
                                object-position: center;
                                background-color: #000;
                            }

                            /* Crossfade Transition */
                            .hero-bg-wrapper {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                opacity: 0;
                                transition: opacity 1.5s ease-in-out;
                                z-index: -1;
                            }
                            .hero-bg-wrapper.active {
                                opacity: 1;
                                z-index: 1;
                            }
                            .hero-bg-wrapper.prev {
                                opacity: 0;
                                z-index: 0;
                            }

                            /* Animation */
                            .active .hero-bg-image {
                                animation: zoomSlow 7s ease-out forwards;
                            }

                            .prev .hero-bg-image {
                                transform: scale(1.1); /* Hold zoom level on exit */
                            }

                            /* Mobile Optimization */
                            @media (max-width: 768px) {
                                .hero-bg-image {
                                    object-fit: cover !important;
                                    background-color: transparent !important;
                                    height: 100vh;
                                    min-height: 100vh;
                                    /* Less zoom on mobile */
                                    transform-origin: center;
                                }
                                /* Adjust Keyframes for mobile - less zoom */
                                @keyframes zoomSlowMobile {
                                    from { transform: scale(1); }
                                    to { transform: scale(1.05); } 
                                }
                                .active .hero-bg-image {
                                    animation: zoomSlowMobile 7s ease-out forwards;
                                }
                                .prev .hero-bg-image {
                                    transform: scale(1.05);
                                }
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
                        zIndex: 2
                    }}></div>

                    {/* Slideshow Container (Stacked) */}
                    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
                        {originalImages.map((imgSrc, index) => {
                            const isActive = index === currentIndex;
                            // Determine if this is the "previous" slide (the one fading out)
                            // We'll use a simple check: if it's not active, but was just active
                            // Ideally we track 'prevIndex', but for a simple rotation, 
                            // we can say: if not active, opacity is 0. 
                            // The CSS transition on wrapper handles the fade out.
                            // To fix the "cutout" issue, we ensure the outgoing image stays fully opaque 
                            // until the new one is fully visible? No, crossfade means both are visible.
                            // The issue described ("outgoing image still remains... yet another pic is being displayed")
                            // implies a gap or a jump.
                            // With absolute positioning + opacity transition, they overlap perfectly.

                            // Logic for "previous":
                            const isPrev = index === (currentIndex - 1 + originalImages.length) % originalImages.length;

                            return (
                                <div
                                    key={index}
                                    className={`hero-bg-wrapper ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''}`}
                                >
                                    <img
                                        src={imgSrc}
                                        alt="The Serenity Spa"
                                        className="hero-bg-image"
                                    />
                                </div>
                            );
                        })}
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
                        <h1 className="gradient-text animate-fade-in-down" style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1rem',
                            fontFamily: '"Times New Roman", Times, serif'
                        }}>
                            THE SERENITY SPA
                        </h1>
                        <p className="animate-fade-in-up delay-200" style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                            Your Oasis of Relaxation
                        </p>
                        <p className="animate-fade-in-up delay-300" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            📍 Makerere, Kampala
                        </p>
                        <div className="animate-scale-in delay-400" style={{ marginTop: '2rem' }}>
                            <Link
                                to="/spa/services"
                                className="magnetic"
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
                            <Link
                                to="/spa/services#vip-section"
                                className="magnetic animate-pulse-gold"
                                style={{
                                    padding: '1rem 2.5rem',
                                    backgroundColor: 'transparent',
                                    color: '#ffffff',
                                    border: '2px solid #C5A059',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    marginLeft: '1rem',
                                    marginTop: '1rem', // Stack on mobile if needed
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.backgroundColor = '#C5A059';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.backgroundColor = 'transparent';
                                }}
                            >
                                VIP Specials
                            </Link>
                        </div>
                    </div>
                </div>
            </section >

            {/* Price List */}
            <PriceList />

            {/* Reviews */}
            <Reviews type="spa" />

            {/* Contact */}
            <Contact />
        </div >
    );
};

export default SpaPage;
