import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HotelPriceList from './HotelPriceList';
import ServiceCard from './ServiceCard';
import { useScrollReveal } from '../hooks/useAnimations';

const HotelPage = () => {
    // Slideshow State
    const originalImages = [
        '/assets/hotel-hero-bg-2.jpg',
        '/assets/hotel-hero-bg.jpg'
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
            {/* Hotel Hero Section */}
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
                            
                            .hero-bg-image {
                                width: 100%;
                                min-width: 100%;
                                flex-shrink: 0;
                                height: auto;
                                display: block;
                                min-height: 600px;
                                object-fit: cover;
                                backface-visibility: hidden;
                                transform: translateZ(0) scale(1);
                                image-rendering: high-quality;
                                object-position: center 75%;
                                transition: transform 7s ease-out; /* Smooth zoom transition */
                            }

                            /* Active Slide Zoom Effect */
                            .hero-bg-image.active-slide {
                                transform: translateZ(0) scale(1.1);
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

                    {/* Slider Window */}
                    <div className="hero-slider-track" style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
                    }}>
                        {extendedImages.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt="The Marina Stays"
                                className={`hero-bg-image ${index === currentIndex && isMounted ? 'active-slide' : ''}`}
                            />
                        ))}
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
                        color: '#ffffff', // Revert text color to white for body text
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        zIndex: 2,
                        paddingTop: 'clamp(100px, 22vh, 200px)' // Consistent spacing (lowered)
                    }}
                >
                    <div className="container">
                        <h1 className="typewriter-effect" style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1rem',
                            fontFamily: '"Times New Roman", Times, serif',
                            color: '#8B4513',
                            borderRightColor: '#8B4513', // Override cursor color
                            width: 'fit-content',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            THE MARINA STAYS
                        </h1>
                        <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                            Entebbe's Premier Residences
                        </p>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1rem' }}>
                            📍 Entebbe, Uganda
                        </p>
                        <p style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: '1.8' }}>
                            Experience luxury accommodation with stunning lake views, world-class amenities,
                            and exceptional hospitality at Entebbe's finest private hotel.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link
                                to="/hotel/rooms"
                                style={{
                                    padding: '1rem 2.5rem',
                                    backgroundColor: '#ffffff',
                                    color: '#8B4513',
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
                                Book Your Stay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hotel Price List */}
            <HotelPriceList />

            {/* Hotel Specials */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f5f5f5' }}>
                <div className="container">
                    <h2 className="gradient-text-gold scroll-reveal" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>
                        Hotel Specials
                    </h2>
                    <p className="scroll-reveal delay-200" style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        Enjoy our exclusive Oak & Tonic Bar and Marina Cafeteria offerings
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                image: '/assets/hotel_specials/nojito_closeup.jpg',
                                title: 'Classic Nojito',
                                desc: 'Our signature Nojito with fresh lime, ice & cherries'
                            },
                            {
                                image: '/assets/hotel_specials/nojito_menu.jpg',
                                title: 'Nojito Menu',
                                desc: 'Refreshing Nojitos - Classic, Coco Le Blue, Lavender & More'
                            },
                            {
                                image: '/assets/hotel_specials/cocktails_1.jpg',
                                title: 'Signature Cocktails',
                                desc: 'Premium Cocktails from Oak & Tonic Bar'
                            },
                            {
                                image: '/assets/hotel_specials/cocktails_menu.jpg',
                                title: 'Cocktails & Juices',
                                desc: 'Fresh Juices, Cocktails & Marina\'s Special Blends'
                            },
                            {
                                image: '/assets/hotel_specials/cafe_menu.jpg',
                                title: 'Café Menu',
                                desc: 'Espresso, Cappuccino, Latte & More from Marina Cafeteria'
                            },
                            {
                                image: '/assets/hotel_specials/breakfast_menu.jpg',
                                title: 'Breakfast Specials',
                                desc: 'Toasted Bread, Eggs, Sausages, Pancakes & More'
                            }
                        ].map((special, index) => (
                            <div
                                key={index}
                                className={`scroll-reveal-float hover-lift delay-${(index + 3) * 100}`}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div className="hover-zoom" style={{
                                    height: '300px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img
                                        src={special.image}
                                        alt={special.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: index === 0 ? 'contain' : 'cover'
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 className="typewriter-scrolled" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#8B4513' }}>
                                        {special.title}
                                    </h3>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                                        {special.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Contact Info */}
            <section style={{ padding: '5rem 0', backgroundColor: '#8B4513', color: '#ffffff' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Visit Us</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        📍 Entebbe, Uganda
                    </p>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        📞 +256 XXX XXX XXX
                    </p>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                        ✉️ info@themarinastays.com
                    </p>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        Open 24/7 for your convenience
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HotelPage;
