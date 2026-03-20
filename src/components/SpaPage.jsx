'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
        '/assets/spa-new-3.jpg',
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
            }, 1550);
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

                            /* Animation */
                            .hero-bg-image.active {
                                animation: zoomSlow 7s ease-out forwards;
                            }
                            
                            /* Keep outgoing slide zoomed */
                            .hero-bg-image.prev {
                                transform: scale(1.1);
                            }

                            /* Mobile Optimization */
                            @media (max-width: 768px) {
                                .hero-bg-image {
                                    object-fit: cover !important;
                                    background-color: transparent !important;
                                    height: 100vh;
                                    min-height: 100vh;
                                    transform-origin: center;
                                }
                                @keyframes zoomSlowMobile {
                                    from { transform: scale(1); }
                                    to { transform: scale(1.05); } 
                                }
                                .hero-bg-image.active {
                                    animation: zoomSlowMobile 7s ease-out forwards;
                                }
                                .hero-bg-image.prev {
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

                    {/* Slider Window */}
                    <div className="hero-slider-track" style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 1.5s ease-in-out' : 'none'
                    }}>
                        {extendedImages.map((imgSrc, index) => {
                            const isActive = index === currentIndex;
                            // Outgoing slide is the one immediately before the current one
                            const isPrev = index === currentIndex - 1 || (currentIndex === 0 && index === extendedImages.length - 2);
                            // Note: Wrap around logic for prev might be tricky with cloning. 
                            // If we slide 0 -> 1, 0 is prev.
                            // If we slide N -> Clone, N is prev.
                            // We just need to ensure the one TO THE LEFT is scaled up.

                            return (
                                <div
                                    key={index}
                                    style={{ width: '100%', minWidth: '100%', height: '100%' }}
                                >
                                    <img
                                        src={imgSrc}
                                        alt="The Serenity Spa"
                                        className={`hero-bg-image ${isActive ? 'active' : ''} ${index === currentIndex - 1 ? 'prev' : ''}`}
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
                        {/* Business Name with Typewriter Wrapper */}
                        <div style={{
                            position: 'relative',
                            display: 'inline-block',
                            marginBottom: '1rem',
                            maxWidth: '100%' // Ensure mobile fit
                        }}>
                            {/* Invisible Spacer to set exact width */}
                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
                                fontWeight: '800',
                                fontFamily: '"Times New Roman", Times, serif',
                                letterSpacing: '2px',
                                opacity: 0,
                                margin: 0,
                                padding: 0,
                                pointerEvents: 'none',
                                width: 'max-content',
                                whiteSpace: 'nowrap' // Keep single line unless really small
                            }}>
                                THE SERENITY SPA
                            </h1>

                            {/* Animated Overlay */}
                            <h1
                                className="typewriter-effect"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '0',
                                    height: '100%',
                                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                                    fontWeight: '800',
                                    color: '#005C53',
                                    fontFamily: '"Times New Roman", Times, serif',
                                    letterSpacing: '2px',
                                    textShadow: 'none',
                                    borderRightColor: '#005C53',
                                    margin: 0,
                                    padding: 0,
                                    animationDelay: '0.5s',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden'
                                }}
                            >
                                THE SERENITY SPA
                            </h1>
                        </div>
                        <p className="animate-fade-in-up delay-200" style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                            Your Oasis of Relaxation
                        </p>
                        <p className="animate-fade-in-up delay-300" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            📍 Makerere, Kampala
                        </p>
                        <div className="animate-scale-in delay-400" style={{ marginTop: '2rem' }}>
                            <Link
                                href="/spa/services"
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
                                href="/spa/services#vip-section"
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
