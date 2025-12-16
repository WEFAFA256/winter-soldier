import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DualHero = ({ onBusinessChange }) => {
    // Images Array: 0: Hotel(1), 1: Spa(1), 2: Hotel(2), 3: Spa(2)
    const originalImages = [
        '/assets/hotel-bg.jpg',
        '/assets/spa-bg.jpg',
        '/assets/hotel-bg-2.jpg',
        '/assets/spa-bg-2.jpg',
        '/assets/hotel-slide-3.jpg',
        '/assets/spa-slide-3.jpg'
    ];
    // No need for extended images for fade effect
    const extendedImages = originalImages;

    // Slider State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Text Fade State
    const [textVisible, setTextVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Initial mount effect to trigger first zoom
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Initial business set
    useEffect(() => {
        if (onBusinessChange) {
            onBusinessChange('hotel');
        }
    }, []);

    // Timer triggers slide and text toggle
    useEffect(() => {
        let textTimer;

        const interval = setInterval(() => {
            // 1. Start Text Fade Out
            setTextVisible(false);

            // 2. Start Slide (after short delay for text to fade?) or immediately?
            // Let's slide immediately. Text will fade out during slide.
            setCurrentIndex(prev => prev + 1);

            // 3. After slide/fade time, Text Fades In (driven by render change usually)
            // But we need to toggle 'textVisible' back to true after content update.
            // If slide takes 1s. Text Fade Out takes 0.5s.
            // At 0.5s, update Content? No, Content updates when currentIndex changes (immediately).
            // So if we change index, content flips.
            // We want old text to fade out -> Flip Content -> New text fade in.
            // To do this strictly: Fade Out -> (Wait) -> Change Index -> (Wait) -> Fade In.
            // But Slider needs to move continuously?
            // "Current image slides left as new slides in".
            // So Slide happens. Text can Fade Out/In on top.

            // Revised flow:
            // T=0: setTextVisible(false). (Fade out old).
            // T=0.5s: setCurrentIndex(+1). (Slide starts physically, content updates).
            // T=0.6s: setTextVisible(true). (Fade in new).
            // This ensures text is hidden during the "swap" moment if distinct, or just transition.

            // However, sliding happens over 1s.
            // If we delay Index update, slide is delayed.
            // Let's just let text fade out/in smoothly.

            setTimeout(() => {
                setTextVisible(true);
            }, 600); // Fade in after 600ms (Slide is halfway)

        }, 6000);

        return () => {
            clearInterval(interval);
            clearTimeout(textTimer);
        };
    }, []);

    // Cyclic reset handled naturally by modulo in rendering if we wanted, 
    // but here we just increment. To prevent integer overflow eventuall (unlikely but clean), reset.
    useEffect(() => {
        if (currentIndex >= originalImages.length) {
            setCurrentIndex(0);
        }
    }, [currentIndex]);

    // Update Business Type based on index
    useEffect(() => {
        const effectiveIndex = currentIndex % originalImages.length;
        // Even = Hotel, Odd = Spa
        const nextBusiness = (effectiveIndex % 2 === 0) ? 'hotel' : 'spa';
        if (onBusinessChange) {
            onBusinessChange(nextBusiness);
        }
    }, [currentIndex, onBusinessChange, originalImages.length]);

    // currentContent Calculation
    const effectiveIndex = currentIndex % originalImages.length;
    const currentBusiness = (effectiveIndex % 2 === 0) ? 'hotel' : 'spa';

    const spaContent = {
        logo: '/assets/logo.jpg',
        name: 'THE SERENITY SPA',
        tagline: 'Your Oasis of Relaxation',
        location: 'Makerere, Kampala',
        description: 'Experience ultimate relaxation with our premium massage and spa services',
        cta: 'Book Spa Service',
        link: '/spa',
        color: '#005C53' // Updated Deep Teal
    };

    const hotelContent = {
        logo: '/assets/hotel-logo.png',
        name: 'THE MARINA STAYS',
        tagline: 'Entebbe\'s Premier Residences',
        location: 'Entebbe, Uganda',
        description: 'Luxury accommodation with stunning views and world-class amenities',
        cta: 'Book Your Stay',
        link: '/hotel',
        color: '#8B4513' // Updated Brown
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
            {/* Background Slideshow - Slider Track */}
            <div style={{ position: 'relative', width: '100%' }}>

                {/* Content Container - Absolute Overlay */}
                <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                    {extendedImages.map((imgSrc, index) => (
                        <div
                            key={index}
                            className={`hero-bg-image ${index === currentIndex ? 'active' : ''}`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: index === currentIndex ? 1 : 0,
                                transition: 'opacity 1.5s ease-in-out',
                                zIndex: index === currentIndex ? 0 : -1
                            }}
                        >
                            <img
                                src={imgSrc}
                                alt={`Slide ${index}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center 75%',
                                    transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 6s ease-out'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Container - Absolute Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    zIndex: 2,
                    textAlign: 'center',
                    paddingTop: 'clamp(60px, 12vh, 100px)',
                    paddingBottom: '2rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                }}
            >
                {/* Logo with Fade Animation */}
                <div
                    className={`logo-container`}
                    style={{
                        marginBottom: '2rem',
                        opacity: textVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
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

                {/* Business Name with Fade */}
                <h1
                    className={`business-name`}
                    style={{
                        fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                        fontWeight: '800',
                        color: content.color,
                        marginBottom: '1rem',
                        fontFamily: '"Times New Roman", Times, serif',
                        letterSpacing: '2px',
                        textShadow: 'none',
                        opacity: textVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                >
                    {content.name}
                </h1>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontStyle: 'italic',
                        marginBottom: '0.5rem',
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        opacity: textVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        transitionDelay: '0.1s'
                    }}
                >
                    {content.tagline}
                </p>

                {/* Location */}
                <p
                    style={{
                        marginBottom: '2rem',
                        color: '#f0f0f0',
                        fontSize: '1.1rem',
                        opacity: textVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        transitionDelay: '0.2s'
                    }}
                >
                    📍 {content.location}
                </p>

                {/* Buttons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        opacity: textVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        transitionDelay: '0.3s'
                    }}
                >
                    <Link
                        to={content.link}
                        className="btn-primary"
                        style={{
                            padding: '1rem 2rem',
                            backgroundColor: content.color,
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            transition: 'transform 0.3s ease, background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.filter = 'brightness(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.filter = 'brightness(1)';
                        }}
                    >
                        {content.cta}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DualHero;
