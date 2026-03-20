'use client';

import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const GalleryImage = ({ src, alt, delay }) => {
    const ref = useScrollAnimation('animate-fade-in');

    return (
        <div
            ref={ref}
            className={`animate-on-scroll ${delay}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '10px',
                height: '300px',
                cursor: 'pointer',
            }}
        >
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease, filter 0.5s ease',
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'brightness(1)';
                }}
            />
        </div>
    );
};

const Gallery = () => {
    const headerRef = useScrollAnimation('animate-float-up');

    const images = [
        { src: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Relaxing Pool', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Massage Therapy', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Facial Treatment', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Hot Stones', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Candlelit Room', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Mountain View', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Luxury Interior', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1591343395082-e21b64b54cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Therapist', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Aromatherapy', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1596178060810-f2de12c54ca2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Products', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Relaxation Room', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Lounge', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1562343528-44c97b4c6568?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Body Massage', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Towels', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Wellness Center', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Treatment Room', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Relaxing Bath', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Flowers', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Yoga Session', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1590556409324-aa1d5f6e7d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Meditation Space', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Reception', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1598662957477-2b81d9423b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Essential Oils', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1545262810-77515befe149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Steam Room', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Candles', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Wellness Retreat', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Body Scrub', delay: 'delay-200' },
        { src: 'https://images.unsplash.com/photo-1576669801775-c8d109f5edf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Couples Massage', delay: 'delay-300' },
        { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Spa Ambiance', delay: 'delay-100' },
        { src: 'https://images.unsplash.com/photo-15444161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Manicure Station', delay: 'delay-200' },
    ];

    return (
        <section className="section-padding" style={{ marginTop: '80px', backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 ref={headerRef} className="animate-on-scroll" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Gallery</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Take a glimpse into our world of tranquility and meet our dedicated team of professionals.
                    </p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {images.map((img, index) => (
                        <GalleryImage key={index} {...img} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
