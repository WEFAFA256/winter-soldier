'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
    const titleRef = useScrollAnimation('animate-float-up');
    const textRef = useScrollAnimation('animate-float-up');
    const btnRef = useScrollAnimation('animate-float-up');

    const slides = [
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/slide_1.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/slide_2.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/slide_3.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/slide_4.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/slide_5.jpg',
        'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/slide_6.jpg'
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    const getSlideClass = (index) => {
        if (index === currentSlide) return 'active';
        const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
        if (index === prevSlide) return 'prev';
        return '';
    };

    return (
        <section
            id="home"
            style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--color-white)',
            }}
        >
            <div className="hero-slideshow">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${getSlideClass(index)}`}
                    >
                        <div
                            className="hero-slide-image"
                            style={{ backgroundImage: `url(${slide})` }}
                        />
                    </div>
                ))}
                <div className="hero-overlay"></div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <h1
                    ref={titleRef}
                    className="animate-on-scroll hero-title"
                    style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                    OASIS OF RELAXATION
                </h1>
                <p
                    ref={textRef}
                    className="animate-on-scroll delay-200 hero-text"
                    style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}
                >
                    Experience the ultimate relaxation and rejuvenation at Serenity Spa.
                    Where calmness meets luxury.
                </p>
                <div ref={btnRef} className="animate-on-scroll delay-400">
                    <Link href="/services" className="btn">
                        Book an Appointment
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
