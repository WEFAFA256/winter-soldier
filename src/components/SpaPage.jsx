'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Services from './Services';
import Gallery from './Gallery';
import Contact from './Contact';
import PriceList from './PriceList';
import { useScrollReveal } from '../hooks/useAnimations';

import Reviews from './Reviews';

const SpaPage = () => {
    // Slideshow State
    const originalImages = [
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-hero-bg-2.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-hero-bg.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-new-3.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-new-1.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/spa-new-2.jpg'
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
                            >
                                <Image
                                    key={index}
                                    quality={100}
                                    src={imgSrc}
                                    alt="The Serenity Spa"
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
                        justifyContent: 'flex-start', // Fixed top position
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        zIndex: 2,
                        paddingTop: 'clamp(80px, 12vh, 120px)' 
                    }}
                >
                    <div className="container" style={{ maxWidth: '100%', padding: '0 1rem' }}>
                        {/* Business Name with Typewriter Wrapper */}
                        <div style={{
                            position: 'relative',
                            display: 'inline-block',
                            marginBottom: '0.5rem',
                            maxWidth: '90%'
                        }}>
                            {/* Invisible Spacer */}
                            <div className="hero-mobile-title" style={{
                                fontSize: 'clamp(1.4rem, 4.5vw, 3.5rem)',
                                fontWeight: '800',
                                fontFamily: '"Times New Roman", Times, serif',
                                letterSpacing: '1px',
                                opacity: 0,
                                margin: 0,
                                padding: '0 0.5rem 0 0',
                                pointerEvents: 'none',
                                width: 'max-content',
                                whiteSpace: 'nowrap'
                            }}>
                                THE SERENITY SPA&nbsp;
                            </div>

                            {/* Animated Overlay */}
                            <h1
                                className="typewriter-effect hero-mobile-title"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '0',
                                    height: '100%',
                                    fontSize: 'clamp(1.4rem, 4.5vw, 3.5rem)',
                                    fontWeight: '800',
                                    color: '#005C53',
                                    fontFamily: '"Times New Roman", Times, serif',
                                    letterSpacing: '1px',
                                    textShadow: 'none',
                                    borderRightColor: '#005C53',
                                    margin: 0,
                                    padding: '0 0.5rem 0 0',
                                    animationDelay: '0.5s',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    display: 'inline-block',
                                    boxSizing: 'content-box',
                                    minWidth: 'fit-content'
                                }}
                            >
                                THE SERENITY SPA
                            </h1>
                        </div>
                        <p className="animate-fade-in-up delay-200 hero-mobile-tagline" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontStyle: 'italic', marginBottom: '0.2rem' }}>
                            Your Oasis of Relaxation
                        </p>
                        <p className="animate-fade-in-up delay-300" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            📍 Makerere, Kampala
                        </p>
                        <div className="animate-scale-in delay-400 hero-buttons-container" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link
                                href="/spa/services"
                                className="magnetic"
                                style={{
                                    padding: '0.8rem 1.8rem',
                                    backgroundColor: '#ffffff',
                                    color: '#005C53',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                Book Spa Service
                            </Link>
                            <Link
                                href="/spa/services#vip-section"
                                className="magnetic animate-pulse-gold"
                                style={{
                                    padding: '0.8rem 1.8rem',
                                    backgroundColor: 'transparent',
                                    color: '#ffffff',
                                    border: '2px solid #C5A059',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease'
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
