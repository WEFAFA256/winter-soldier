'use client';

import React from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
    const textRef = useScrollAnimation('animate-float-right');
    const imgRef = useScrollAnimation('animate-float-left');

    return (
        <section id="about" className="section-padding" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <div ref={imgRef} className="animate-on-scroll" style={{ position: 'relative' }}>
                            <div style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '300px' }}>
                                <Image
                                    src="/assets/ambience.png"
                                    alt="Spa Ambience"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                                    className="hover-lift"
                                />
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    right: '-20px',
                                    backgroundColor: 'var(--color-white)',
                                    padding: '2rem',
                                    borderRadius: '10px',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                    maxWidth: '200px',
                                }}
                            >
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                                    "A sanctuary for the senses."
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: '1 1 400px' }}>
                        <div ref={textRef} className="animate-on-scroll delay-200">
                            <h4 style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>About Us</h4>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Experience the Art of Relaxation</h2>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
                                At Serenity Spa, we believe that relaxation is not just a luxury, but a necessity. Our sanctuary is designed to transport you to a world of peace and tranquility, away from the hustle and bustle of daily life.
                            </p>
                            <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
                                Our expert therapists use only the finest organic products to ensure that your experience is as nourishing for your body as it is for your soul.
                            </p>
                            <a href="#contact" className="btn-outline" style={{ padding: '0.8rem 2rem', borderRadius: '50px', textDecoration: 'none', display: 'inline-block' }}>
                                Discover More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;