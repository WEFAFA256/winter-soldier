'use client';

import React from 'react';

const SocialMediaIcons = () => {
    const socials = [
        {
            name: 'Instagram',
            image: '/assets/instagram-icon.jpg',
            url: 'https://www.instagram.com/theserenityspaug/',
            delay: '0s'
        },
        {
            name: 'WhatsApp',
            image: '/assets/whatsapp-icon.jpg',
            url: 'https://wa.me/256764001922',
            delay: '0.2s'
        },
        {
            name: 'Phone',
            image: '/assets/phone-icon.jpg',
            url: 'tel:+256764001922',
            delay: '0.4s'
        },
    ];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                zIndex: 1000,
            }}
        >
            {socials.map((social, index) => (
                <a
                    key={index}
                    href={social.url}
                    target={social.name === 'Phone' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="social-icon"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        animation: `bounce 2s infinite ${social.delay}`,
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <img
                        src={social.image}
                        alt={social.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </a>
            ))}
        </div>
    );
};

export default SocialMediaIcons;
