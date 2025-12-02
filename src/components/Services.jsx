import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ServiceCard = ({ title, image, description, delay, fullImage, onLearnMore, imageOnly }) => {
    const cardRef = useScrollAnimation('animate-float-up');
    const imageRef = useScrollAnimation('animate-slide-scale');
    const textRef = useScrollAnimation('animate-float-up');

    if (imageOnly) {
        return (
            <div
                ref={imageRef}
                className={`animate-on-scroll ${delay}`}
                style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                }}
                onClick={() => onLearnMore && onLearnMore()}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img
                    src={image}
                    alt="Price List"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            </div>
        );
    }

    return (
        <div
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
            <div
                ref={imageRef}
                className={`animate-on-scroll ${delay}`}
                style={{ height: '250px', overflow: 'hidden' }}
            >
                <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </div>
            <div
                ref={textRef}
                className={`animate-on-scroll ${delay}`}
                style={{ padding: '2rem' }}
            >
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>{description}</p>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (onLearnMore) onLearnMore();
                    }}
                    style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                    Learn More &rarr;
                </a>
            </div>
        </div>
    );
};

const ImageModal = ({ isOpen, onClose, imageSrc, title }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                cursor: 'pointer',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    maxWidth: '90%',
                    maxHeight: '90%',
                    cursor: 'default',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '0',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                    }}
                >
                    ✕
                </button>
                <img
                    src={imageSrc}
                    alt={title}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                        borderRadius: '10px',
                    }}
                />
            </div>
        </div>
    );
};

const Services = () => {
    const headerRef = useScrollAnimation('animate-float-up');
    const [modalState, setModalState] = useState({ isOpen: false, imageSrc: '', title: '' });

    const openModal = (imageSrc, title) => {
        setModalState({ isOpen: true, imageSrc, title });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, imageSrc: '', title: '' });
    };

    const services = [
        {
            title: 'Swedish Massage',
            image: '/assets/service1.jpg',
            fullImage: '/assets/swedish-massage-full.jpg',
            description: 'This is one of the most common & basic massage types traditionally for relaxing the mind & soothing the body. It\'s performed with slow simple calm movements to energize the body & overall health involving actions ie. Kneading, Rolling & Tapping. Oils are used.',
            delay: 'delay-100',
        },
        {
            title: 'Deeptissue Massage',
            image: '/assets/service2.jpg',
            fullImage: '/assets/deeptissue-massage-full.jpg',
            description: 'Simillar to Swedish Massage, also known as Hard Massage but with a deeptissue massage, the therapist applies slow, firm pressure to release muscle tension. The focus is on the deepest layers of muscle tissue, tendons & fasia. Highly recommended for clients with body pains, aches',
            delay: 'delay-200',
        },
        {
            title: 'Aromatherapy',
            image: '/assets/service4.jpg',
            fullImage: '/assets/aromatherapy-full.jpg',
            description: 'Aromatherapy incorporates the use of warm scented essential oils into a massage while alternating between gentle and harder pressure while using a specific blend of essential oils. Highly recommended for Clients working in fumes,etc to renew the Breathe Senses & Relax',
            delay: 'delay-300',
        },
        {
            title: 'Erotic & Body to Body',
            image: '/assets/service3.jpg',
            fullImage: '/assets/erotic-massage-full.jpg',
            description: 'Definetely the most Relaxing & Sensual Massage Session combining Erotic Soothing Touches & Body 2 body Sensual Techniques of Romance. Except its more gentle & affectionate with calm relaxing touches to arouse intimacy',
            delay: 'delay-100',
        },
        {
            title: 'Xclusive Sessions',
            image: '/assets/service5.jpg',
            fullImage: '/assets/xclusive-sessions-full.jpg',
            description: 'The most sensual Erotically Satisfying Session due to the Pleasure it comes with combining B2b & Erotic Massage Techniques to arouse the Client in an immense Romantic Yoni | Tantric Feeling. Its\' inclusive of a Pack Of Extras',
            delay: 'delay-200',
        },
        {
            title: 'Turkish Bath Packages',
            image: '/assets/service6.jpg',
            fullImage: '/assets/turkish-bath-full.jpg',
            description: 'Time for Real Pampering & Soothing of that Body of Yours? Out for a 90 | 120mins Bath Session as a Spa Day Package We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-300',
        },
        {
            title: 'Body Care Packages',
            image: '/assets/service7.jpg',
            fullImage: '/assets/body-care-full.jpg',
            description: 'Got the time for Pure Relaxation & Stress Off? Out for a 120mins | 180mins Session as a Package for the Spa Day. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-100',
        },
        {
            title: 'Couples | Duo Packages',
            image: '/assets/service8.jpg',
            fullImage: '/assets/couples-duo-full.jpg',
            description: 'Got the time for Pure Relaxation & Stress Off? Out for a 90mins | 120mins Session as a Package for the Spa Day. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-200',
        },
        {
            title: 'Womens\' Packages',
            image: '/assets/service9.jpg',
            fullImage: '/assets/womens-packages-full.jpg',
            description: 'Out for a Massage Service? Planning for a 90mins | 120mins Session as a Mini Relaxation Package for the Girls Day Out. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-300',
        },
        {
            title: '',
            image: '/assets/affluent-pack.jpg',
            fullImage: '/assets/affluent-pack.jpg',
            description: '',
            delay: 'delay-100',
            imageOnly: true,
        },
        {
            title: '',
            image: '/assets/premium-pack.jpg',
            fullImage: '/assets/premium-pack.jpg',
            description: '',
            delay: 'delay-200',
            imageOnly: true,
        },
        {
            title: '',
            image: '/assets/classical-pack.jpg',
            fullImage: '/assets/classical-pack.jpg',
            description: '',
            delay: 'delay-300',
            imageOnly: true,
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
                        <ServiceCard
                            key={index}
                            {...service}
                            onLearnMore={() => openModal(service.fullImage, service.title)}
                        />
                    ))}
                </div>
            </div>
            <ImageModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                imageSrc={modalState.imageSrc}
                title={modalState.title}
            />
        </section>
    );
};

export default Services;
