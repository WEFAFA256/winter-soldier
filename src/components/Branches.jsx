'use client';

import React from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const BranchCard = ({ name, image, description, address, delay }) => {
    const ref = useScrollAnimation('animate-float-up');

    return (
        <div
            ref={ref}
            className={`animate-on-scroll ${delay}`}
            style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="hover-scale"
                />
            </div>
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--color-primary)' }}>{name}</h3>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontStyle: 'italic' }}>{address}</p>
                <p style={{ color: 'var(--color-text)', marginBottom: '1.5rem' }}>{description}</p>
                <a href="#" className="btn-outline" style={{ display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', textDecoration: 'none' }}>
                    View Details
                </a>
            </div>
        </div>
    );
};

const Branches = () => {
    const headerRef = useScrollAnimation('animate-float-up');

    const branches = [
        {
            name: 'Downtown Serenity',
            image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            address: '123 Main St, City Center',
            description: 'Our flagship location in the heart of the city, offering a quick escape from the urban hustle.',
            delay: 'delay-100',
        },
        {
            name: 'Mountain Retreat',
            image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            address: '456 Alpine Way, High Peaks',
            description: 'Nestled in the mountains, this location offers breathtaking views and nature-inspired treatments.',
            delay: 'delay-200',
        },
        {
            name: 'Seaside Escape',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            address: '789 Ocean Blvd, Coastal Bay',
            description: 'Experience the healing power of the ocean with our thalassotherapy and sea salt scrubs.',
            delay: 'delay-300',
        },
    ];

    return (
        <section className="section-padding" style={{ marginTop: '80px', backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 ref={headerRef} className="animate-on-scroll" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Locations</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Visit us at one of our three exclusive locations, each designed to provide a unique sanctuary of peace.
                    </p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '3rem',
                    }}
                >
                    {branches.map((branch, index) => (
                        <BranchCard key={index} {...branch} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Branches;