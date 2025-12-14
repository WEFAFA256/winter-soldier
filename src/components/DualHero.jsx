import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DualHero = ({ onBusinessChange }) => {
    // Cycle through 0-3: 
    // 0: Hotel (Img 1), 1: Spa (Img 1), 2: Hotel (Img 2), 3: Spa (Img 2)
    const [cycleIndex, setCycleIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Initial business change notification
    useEffect(() => {
        if (onBusinessChange) {
            onBusinessChange('hotel');
        }
    }, []);

    // Cycle every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCycleIndex(prev => {
                    const nextIndex = (prev + 1) % 4;
                    // Determine business type for next index
                    const nextBusiness = (nextIndex === 0 || nextIndex === 2) ? 'hotel' : 'spa';

                    if (onBusinessChange) {
                        onBusinessChange(nextBusiness);
                    }
                    return nextIndex;
                });
                setIsTransitioning(false);
            }, 800); // Transition duration
        }, 6000); // Change every 6 seconds

        return () => clearInterval(interval);
    }, [onBusinessChange]);

    // Determine current business and image based on cycle index
    const currentBusiness = (cycleIndex === 0 || cycleIndex === 2) ? 'hotel' : 'spa';

    // Define images for each step
    const bgImages = [
        '/assets/hotel-bg.jpg',   // 0: Hotel 1
        '/assets/spa-bg.jpg',     // 1: Spa 1
        '/assets/hotel-bg-2.jpg', // 2: Hotel 2
        '/assets/spa-bg-2.jpg'    // 3: Spa 2
    ];

    const spaContent = {
        logo: '/assets/logo.jpg',
        name: 'THE SERENITY SPA',
        tagline: 'Your Oasis of Relaxation',
        location: 'Makerere, Kampala',
        description: 'Experience ultimate relaxation with our premium massage and spa services',
        cta: 'Book Spa Service',
        link: '/spa',
        color: 'var(--color-primary)',
        bgImage: bgImages[cycleIndex]
    };

    const hotelContent = {
        logo: '/assets/hotel-logo.png',
        name: 'THE MARINA STAYS',
        tagline: 'Entebbe\'s Premier Residences',
        location: 'Entebbe, Uganda',
        description: 'Luxury accommodation with stunning views and world-class amenities',
        cta: 'Book Your Stay',
        link: '/hotel',
        color: '#8B4513',
        bgImage: bgImages[cycleIndex]
    };

    const content = currentBusiness === 'spa' ? spaContent : hotelContent;

    return (
        <section
            className="dual-hero"
            style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                transition: 'all 0.5s ease-in-out'
            }}
        >
            {/* Background Slideshow - Image Drives Height */}
            <div style={{ position: 'relative', width: '100%' }}>

                <style>
                    {`
                        .hero-bg-image {
                            width: 100%;
                            height: auto;
                            display: block;
                            /* Desktop: Original Aspect Ratio (Full Features) */
                            animation: zoomIn 7s ease-out forwards;
                            backface-visibility: hidden;
                            transform: translateZ(0);
                            image-rendering: high-quality;
                            transition: opacity 0.5s ease-in-out;
                        }

                        /* Mobile: Fix height to stabilize text and show green section */
                        @media (max-width: 768px) {
                            .hero-bg-image {
                                height: 85vh !important; /* Fit screen but show bottom section */
                                object-fit: cover; /* Fill the fixed area */
                                min-height: 500px;
                            }
                        }

                        @keyframes simpleFadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        
                        @keyframes simpleFadeOut {
                            from { opacity: 1; }
                            to { opacity: 0; }
                        }
                    `}
                </style>

                {/* Top Gradient Overlay for Navbar Visibility */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '30%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                    zIndex: 1
                }}></div>

                <img
                    key={cycleIndex} // Re-render on cycle index change to restart animation
                    src={content.bgImage}
                    alt={content.name}
                    className="hero-bg-image"
                // style prop removed in favor of CSS class above for responsiveness
                />
            </div>

            {/* Content Container - Absolute Overlay */}
            <div
                // className="container" <- Removed to prevent max-width constraint on desktop
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start', // Align to top for stability
                    alignItems: 'center',
                    zIndex: 2,
                    textAlign: 'center',
                    paddingTop: 'clamp(60px, 12vh, 100px)', // Fixed position from top (moved up)
                    paddingBottom: '2rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                }}
            >
                {/* Logo with Float-in Animation */}
                <div
                    className={`logo-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}
                    style={{
                        marginBottom: '2rem',
                        animation: isTransitioning ? 'simpleFadeOut 0.6s ease-out forwards' : 'simpleFadeIn 1s ease-out'
                    }}
                >
                    <img
                        src={content.logo}
                        alt={content.name}
                        style={{
                            width: 'clamp(120px, 20vw, 180px)',
                            height: 'clamp(120px, 20vw, 180px)',
                            objectFit: 'contain',
                            borderRadius: '50%',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.8s ease-in-out',
                            border: '5px solid rgba(255, 255, 255, 0.3)'
                        }}
                    />
                </div>

                {/* Business Name with Typewriter Effect */}
                <h1
                    className={`business-name ${isTransitioning ? 'fade-out' : 'type-in'}`}
                    style={{
                        fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                        fontWeight: '800',
                        color: currentBusiness === 'hotel' ? '#8B4513' : '#005C53',
                        marginBottom: '1rem',
                        fontFamily: '"Times New Roman", Times, serif',
                        letterSpacing: '2px',
                        textShadow: 'none', // Removed glowing effect
                        animation: isTransitioning ? 'simpleFadeOut 0.6s ease-out forwards' : 'simpleFadeIn 1.2s ease-out'
                    }}
                >
                    {content.name}
                </h1>

                {/* Tagline */}
                <p
                    className={isTransitioning ? 'fade-out' : 'fade-in'}
                    style={{
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                        color: '#000000',
                        marginBottom: '0.5rem',
                        fontStyle: 'italic',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                        animation: isTransitioning ? 'simpleFadeOut 0.6s ease-out forwards' : 'simpleFadeIn 1.5s ease-out'
                    }}
                >
                    {content.tagline}
                </p>

                {/* Location */}
                <p
                    className={isTransitioning ? 'fade-out' : 'fade-in'}
                    style={{
                        fontSize: '1.1rem',
                        color: '#000000',
                        marginBottom: '2rem',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                        animation: isTransitioning ? 'simpleFadeOut 0.6s ease-out forwards' : 'simpleFadeIn 1.8s ease-out'
                    }}
                >
                    📍 {content.location}
                </p>

                {/* Description */}
                <p
                    className={isTransitioning ? 'fade-out' : 'fade-in'}
                    style={{
                        fontSize: '1.2rem',
                        color: '#000000',
                        maxWidth: '700px',
                        margin: '0 auto 3rem',
                        lineHeight: '1.8',
                        fontWeight: '600',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                        animation: isTransitioning ? 'simpleFadeOut 0.6s ease-out forwards' : 'simpleFadeIn 2s ease-out'
                    }}
                >
                    {content.description}
                </p>

                {/* CTA Buttons */}
                <div
                    className={isTransitioning ? 'fade-out' : 'fade-in'}
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        animation: isTransitioning ? 'simpleFadeOut 0.6s ease-out forwards' : 'simpleFadeIn 2.3s ease-out'
                    }}
                >
                    <Link
                        to={content.link}
                        style={{
                            padding: '1rem 2.5rem',
                            backgroundColor: '#ffffff',
                            color: content.color,
                            borderRadius: '50px',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            border: '2px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
                        }}
                    >
                        {content.cta}
                    </Link>

                    <Link
                        to={currentBusiness === 'spa' ? '/hotel' : '/spa'}
                        style={{
                            padding: '1rem 2.5rem',
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            borderRadius: '50px',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            border: '2px solid rgba(255, 255, 255, 0.8)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        {currentBusiness === 'spa' ? 'Explore Hotel' : 'Explore Spa'}
                    </Link>
                </div>

                {/* Business Indicator */}
                <div
                    style={{
                        marginTop: '4rem',
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: currentBusiness === 'hotel' ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <div
                        style={{
                            width: '40px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: currentBusiness === 'spa' ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes typeIn {
          0% {
            opacity: 0;
            width: 0;
          }
          1% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            width: 100%;
          }
        }

        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .business-name {
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }

        @media (max-width: 768px) {
          .business-name {
            white-space: normal;
          }
        }
      `}</style>
        </section>
    );
};

export default DualHero;
