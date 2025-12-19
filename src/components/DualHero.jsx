import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DualHero = ({ onBusinessChange }) => {
    // Define Hotel and Spa images separately
    const hotelImages = [
        '/assets/hotel-bg.jpg',
        '/assets/hotel-bg-2.jpg',
        '/assets/hotel-slide-3.jpg',
        '/assets/hotel-extra-1.jpg',
        '/assets/hotel-extra-2.jpg',
        '/assets/hotel-extra-3.jpg',
        '/assets/hotel-extra-4.jpg',
        '/assets/hotel-extra-5.jpg',
        '/assets/hotel-extra-6.jpg',
        '/assets/hotel-extra-7.jpg',
        '/assets/hotel-extra-8.jpg'
    ];

    const spaImages = [
        '/assets/spa-bg.jpg',
        '/assets/spa-bg-2.jpg',
        '/assets/spa-slide-3.jpg',
        '/assets/spa-new-1.jpg',
        '/assets/spa-new-2.jpg'
    ];

    // Interleave images to maintain H, S, H, S pattern
    // We loop through hotel images and repeat spa images as needed
    const originalImages = [];
    hotelImages.forEach((hImg, index) => {
        originalImages.push(hImg);
        originalImages.push(spaImages[index % spaImages.length]);
    });

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
    // Preload images
    useEffect(() => {
        originalImages.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    useEffect(() => {
        let fadeOutTimer;
        let fadeInTimer;

        const interval = setInterval(() => {
            // 1. Start Text Fade Out
            setTextVisible(false);

            // 2. Wait for fade out
            fadeOutTimer = setTimeout(() => {
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

                // 3. Fade In
                fadeInTimer = setTimeout(() => {
                    setTextVisible(true);
                }, 100);
            }, 800);

        }, 6000);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeOutTimer);
            clearTimeout(fadeInTimer);
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
                                toggle: index === currentIndex,
                                transition: 'opacity 1.5s ease-in-out',
                                zIndex: index === currentIndex ? 0 : -1
                            }}
                        >
                            <style>
                                {`
                                    @keyframes zoomSlowDual {
                                        from { transform: scale(1); }
                                        to { transform: scale(1.05); }
                                    }
                                    .zoom-animate {
                                        animation: zoomSlowDual 6s ease-out forwards;
                                    }
                                    .zoom-exit {
                                        transform: scale(1.05);
                                    }
                                `}
                            </style>
                            <img
                                src={imgSrc}
                                alt={`Slide ${index}`}
                                className={index === currentIndex ? 'zoom-animate' : (
                                    index === (currentIndex - 1 + extendedImages.length) % extendedImages.length ? 'zoom-exit' : ''
                                )}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center 75%',
                                    backgroundColor: 'transparent',
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
                {/* Business Name with Typewriter Wrapper */}
                <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '1rem'
                }}>
                    {/* Invisible Spacer to set exact width */}
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                        fontWeight: '800',
                        fontFamily: '"Times New Roman", Times, serif',
                        letterSpacing: '2px',
                        opacity: 0,
                        margin: 0,
                        padding: 0,
                        pointerEvents: 'none',
                        width: 'max-content' // Ensure it takes full width of text
                    }}>
                        {content.name}
                    </h1>

                    {/* Animated Overlay */}
                    <h1
                        key={content.name}
                        className="typewriter-effect"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '0',
                            height: '100%',
                            fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                            fontWeight: '800',
                            color: content.color,
                            fontFamily: '"Times New Roman", Times, serif',
                            letterSpacing: '2px',
                            textShadow: 'none',
                            borderRightColor: content.color,
                            margin: 0, // Reset margin
                            padding: 0,
                            animationDelay: '0.5s',
                            opacity: textVisible ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out'
                        }}
                    >
                        {content.name}
                    </h1>
                </div>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontStyle: 'italic',
                        marginBottom: '0.5rem',
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        opacity: textVisible ? 1 : 0,
                        transform: textVisible ? 'translateX(0)' : 'translateX(-50px)',
                        transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-out',
                        transitionDelay: '0.2s'
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
                        transform: textVisible ? 'translateX(0)' : 'translateX(-50px)',
                        transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-out',
                        transitionDelay: '0.4s'
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
                        transform: textVisible ? 'translateX(0)' : 'translateX(-50px)',
                        transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-out',
                        transitionDelay: '0.6s'
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
