import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ServiceCard = ({ title, image, description, delay }) => {
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
            <div style={{ height: '250px', overflow: 'hidden' }}>
                <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </div>
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>{description}</p>
                <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    Learn More &rarr;
                </a>
            </div>
        </div>
    );
};

const Services = () => {
    const headerRef = useScrollAnimation('animate-float-up');

    const services = [
        {
            title: 'Relaxing Massage',
            image: '/assets/massage_service.png',
            description: 'Release tension and stress with our signature full-body massage using organic essential oils.',
            delay: 'delay-100',
        },
        {
            title: 'Rejuvenating Facial',
            image: '/assets/facial_service.png',
            description: 'Restore your skin\'s natural glow with our deep-cleansing and hydrating facial treatments.',
            delay: 'delay-200',
        },
        {
            title: 'Holistic Therapy',
            image: '/assets/ambience.png',
            description: 'Balance your mind and body with our holistic therapies including aromatherapy and hot stone treatments.',
            delay: 'delay-300',
        },
    ];

    return (
        <section id="services" className="section-padding" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 ref={headerRef} className="animate-on-scroll" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Services</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Indulge in our wide range of premium spa treatments designed to relax, renew, and revive.
                    </p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
