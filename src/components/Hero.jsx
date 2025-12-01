import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
    const titleRef = useScrollAnimation('animate-float-up');
    const textRef = useScrollAnimation('animate-float-up');
    const btnRef = useScrollAnimation('animate-float-up');

    return (
        <section
            id="home"
            style={{
                height: '100vh',
                width: '100%',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(/assets/hero_spa.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--color-white)',
            }}
        >
            <div className="container">
                <h1
                    ref={titleRef}
                    className="animate-on-scroll"
                    style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                    Find Your Inner Peace
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
