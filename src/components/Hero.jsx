import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
    const titleRef = useScrollAnimation('animate-float-up');
    const textRef = useScrollAnimation('animate-float-up');
    const btnRef = useScrollAnimation('animate-float-up');

    const slides = [
        '/assets/hero_spa.png',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Massage
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Facial
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Spa stones
        'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Relaxing pool
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Candles
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
                    className="animate-on-scroll"
                    style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                    OASIS OF RELAXATION
                </h1>
                <p
                    ref={textRef}
                    className="animate-on-scroll delay-200"
                    style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}
                >
                    Experience the ultimate relaxation and rejuvenation at Serenity Spa.
                    Where calmness meets luxury.
                </p>
                <div ref={btnRef} className="animate-on-scroll delay-400">
                    <a href="#services" className="btn">
                        Book an Appointment
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
