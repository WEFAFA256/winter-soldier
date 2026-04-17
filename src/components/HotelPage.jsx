'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HotelPriceList from './HotelPriceList';
import ServiceCard from './ServiceCard';
import { useScrollReveal } from '../hooks/useAnimations';
import Reviews from './Reviews';

const HotelPage = () => {
    // Slideshow State
    const originalImages = [
        '/assets/hotel-hero-bg-2.jpg',
        '/assets/hotel-hero-bg.jpg',
        '/assets/hotel-extra-1.jpg',
        '/assets/hotel-extra-2.jpg',
        '/assets/hotel-extra-3.jpg',
        '/assets/hotel-extra-4.jpg',
        '/assets/hotel-extra-5.jpg',
        '/assets/hotel-extra-6.jpg',
        '/assets/hotel-extra-7.jpg',
        '/assets/hotel-extra-8.jpg'
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
            {/* Hotel Hero Section */}
            <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }} role="region" aria-label="Hotel Image Slideshow">
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
                    transition: isTransitioning ? 'transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)' : 'none',
                    display: 'flex',
                    width: '100%',
                    willChange: 'transform'
                }}>
                    {extendedImages.map((imgSrc, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <div
                                key={index}
                                style={{ position: 'relative', width: '100%', minWidth: '100%', minHeight: '600px', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}
                                aria-hidden={!isActive}
                            >
                                <Image
                                    key={index}
                                    quality={100}
                                    src={imgSrc}
                                    alt={`The Marina Stays - Luxury lakeside suite ${index + 1}`}
                                    fill
                                    priority={index < 2}
                                    sizes="100vw"
                                    style={{ objectFit: 'cover' }}
                                    className={isActive ? 'zoom-animate' : 'zoom-exit'}
                                />
                            </div>
                        );
                    })}
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
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        zIndex: 2,
                        paddingTop: 'clamp(100px, 22vh, 200px)'
                    }}
                >
                    <div className="container">
                        <div style={{
                            position: 'relative',
                            display: 'inline-block',
                            marginBottom: '1rem',
                        }}>
                            {/* Invisible spacer — width:max-content forces parent to be
                                exactly as wide as the text, so the typewriter h1's width:100%
                                always expands to the full text width (no clipped last letter) */}
                            <div style={{
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
                                marginBottom: '0',
                                fontFamily: '"Times New Roman", Times, serif',
                                color: '#8B4513',
                                opacity: 0,
                                margin: 0,
                                padding: '0 2rem 0 0', // Even more generous padding
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                width: 'max-content',
                            }}>
                                THE MARINA STAYS&nbsp;&nbsp;
                            </div>
                            <h1 className="typewriter-effect" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '0',
                                height: '100%',
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
                                marginBottom: '0',
                                fontFamily: '"Times New Roman", Times, serif',
                                color: '#8B4513',
                                borderRightColor: '#8B4513',
                                margin: 0,
                                padding: '0 2rem 0 0', // Even more generous padding
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'inline-block',
                                boxSizing: 'content-box', // Ensure padding is extra to width
                                minWidth: 'fit-content' // Try to avoid width: 100% constraints
                            }}>
                                THE MARINA STAYS
                            </h1>
                        </div>

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
                        <div className="hero-buttons-container" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link
                                href="/hotel/rooms"
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
                                    position: 'relative',
                                    height: '300px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Image quality={100} src={special.image}
                                        alt={special.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{
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

            {/* Reviews */}
            <Reviews type="hotel" />
        </div>
    );
};

export default HotelPage;

