'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DualHero = ({ onBusinessChange }) => {
    // Define Hotel and Spa images separately
    const hotelImages = [
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-bg.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-bg-2.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-slide-3.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-1.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-2.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-3.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-4.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-5.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-6.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-7.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-extra-8.jpg'
    ];

    const spaImages = [
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-bg.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-bg-2.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-slide-3.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-new-1.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-new-2.jpg'
    ];

    // Interleave images to maintain H, S, H, S pattern
    const originalImages = [];
    hotelImages.forEach((hImg, index) => {
        originalImages.push(hImg);
        originalImages.push(spaImages[index % spaImages.length]);
    });

    const extendedImages = originalImages;

    // Slider State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [textVisible, setTextVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (onBusinessChange) {
            onBusinessChange('hotel');
        }
    }, [onBusinessChange]);

    useEffect(() => {
        let fadeOutTimer;
        let fadeInTimer;

        const interval = setInterval(() => {
            setTextVisible(false);

            fadeOutTimer = setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % originalImages.length);
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
    }, [originalImages.length]);

    // Update Business Type based on index
    useEffect(() => {
        const nextBusiness = (currentIndex % 2 === 0) ? 'hotel' : 'spa';
        if (onBusinessChange) {
            onBusinessChange(nextBusiness);
        }
    }, [currentIndex, onBusinessChange]);

    const currentBusiness = (currentIndex % 2 === 0) ? 'hotel' : 'spa';

    const spaContent = {
        logo: 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/logo.jpg',
        name: 'THE SERENITY SPA',
        tagline: 'Your Oasis of Relaxation',
        location: 'Makerere, Kampala',
        description: 'Experience ultimate relaxation with our premium massage and spa services',
        cta: 'Book Spa Service',
        link: '/spa',
        color: '#005C53' 
    };

    const hotelContent = {
        logo: 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/hotel-logo.png',
        name: 'THE MARINA STAYS',
        tagline: 'Entebbe\'s Premier Residences',
        location: 'Entebbe, Uganda',
        description: 'Luxury accommodation with stunning views and world-class amenities',
        cta: 'Book Your Stay',
        link: '/hotel',
        color: '#8B4513'
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
            <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000' }}>
                    {extendedImages.map((imgSrc, index) => {
                        const isActive = index === currentIndex;
                        const isPrev = index === (currentIndex - 1 + extendedImages.length) % extendedImages.length;

                        // Keep prev mounted so opacity fade is smooth; hide all others
                        if (!isActive && !isPrev) return null;

                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: isActive ? 1 : 0,
                                    transition: 'opacity 1.5s ease-in-out',
                                    zIndex: isActive ? 1 : 0,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* key={`${index}-${currentIndex}`} forces CSS animation restart
                                    when this slide becomes active, giving a clean Ken Burns zoom
                                    from scale(1) every time with no snap-back glitch */}
                                <Image
                                    key={isActive ? `active-${index}` : `prev-${index}`}
                                    quality={100}
                                    src={imgSrc}
                                    alt={`Slide ${index}`}
                                    fill
                                    priority={index < 2}
                                    sizes="100vw"
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center 75%',
                                    }}
                                    className={isActive ? 'zoom-animate' : 'zoom-exit'}
                                />
                            </div>
                        );
                    })}
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
                        padding: '0 0.5rem 0 0', // Added padding-right to prevent clipping
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
                            padding: '0 0.5rem 0 0', // Added padding-right to prevent clipping
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
                        href={content.link}
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
