import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HotelPage = () => {
    // Slideshow State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Images Array - New image first, then original
    const images = [
        '/assets/hotel-hero-bg-2.jpg',
        '/assets/hotel-hero-bg.jpg'
    ];

    // Cycle images every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div>
            {/* Hotel Hero Section */}
            <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                {/* Background Image - Full Width, Auto Height (Original Aspect Ratio) */}
                {/* Background Slideshow */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <style>
                        {`
                            .hero-bg-image {
                                width: 100%;
                                height: auto;
                                display: block;
                                min-height: 600px;
                                object-fit: cover;
                                animation: zoomIn 7s ease-out forwards;
                                backface-visibility: hidden;
                                transform: translateZ(0);
                                image-rendering: high-quality;
                            }
                            
                            @keyframes zoomIn {
                                0% { transform: scale(1); }
                                100% { transform: scale(1.1); }
                            }
                        `}
                    </style>

                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '30%',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                        zIndex: 1
                    }}></div>

                    {/* Render current image with key to trigger animation */}
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt="The Marina Stays"
                            className="hero-bg-image"
                        />
                    </div>
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
                        color: '#ffffff', // Revert text color to white for body text
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        zIndex: 2,
                        paddingTop: 'clamp(100px, 22vh, 200px)' // Consistent spacing (lowered)
                    }}
                >
                    <div className="container">
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1rem',
                            fontFamily: '"Times New Roman", Times, serif',
                            color: '#8B4513' // Apply Brown ONLY to Heading
                        }}>
                            THE MARINA STAYS
                        </h1>
                        <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                            Entebbe's Premier Residences
                        </p>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1rem' }}>
                            📍 Entebbe, Uganda
                        </p>
                        <p style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: '1.8' }}>
                            Experience luxury accommodation with stunning lake views, world-class amenities,
                            and exceptional hospitality at Entebbe's finest private hotel.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link
                                to="/hotel/booking"
                                style={{
                                    padding: '1rem 2.5rem',
                                    backgroundColor: '#ffffff',
                                    color: '#8B4513',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Book Your Stay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms & Amenities */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#8B4513' }}>
                        Our Rooms & Suites
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { name: 'Deluxe Room', price: 'UGX 200,000/night', features: ['King Size Bed', 'Lake View', 'Free WiFi', 'Breakfast Included'] },
                            { name: 'Executive Suite', price: 'UGX 350,000/night', features: ['Separate Living Area', 'Balcony', 'Mini Bar', 'Airport Transfer'] },
                            { name: 'Presidential Suite', price: 'UGX 500,000/night', features: ['2 Bedrooms', 'Private Pool', 'Butler Service', 'Panoramic Views'] }
                        ].map((room, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '15px',
                                    padding: '2rem',
                                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#8B4513' }}>
                                    {room.name}
                                </h3>
                                <p style={{ fontSize: '1.3rem', fontWeight: '600', color: '#654321', marginBottom: '1.5rem' }}>
                                    {room.price}
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {room.features.map((feature, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem', color: '#666' }}>
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Amenities */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f5f5f5' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#8B4513' }}>
                        Hotel Amenities
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        textAlign: 'center'
                    }}>
                        {[
                            { icon: '🏊', name: 'Swimming Pool', desc: 'Outdoor infinity pool' },
                            { icon: '🍽️', name: 'Restaurant', desc: 'Fine dining experience' },
                            { icon: '🏋️', name: 'Fitness Center', desc: '24/7 gym access' },
                            { icon: '🚗', name: 'Parking', desc: 'Free secure parking' },
                            { icon: '📶', name: 'Free WiFi', desc: 'High-speed internet' },
                            { icon: '🛎️', name: 'Concierge', desc: '24/7 service' }
                        ].map((amenity, index) => (
                            <div key={index} style={{ padding: '1.5rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{amenity.icon}</div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#8B4513' }}>
                                    {amenity.name}
                                </h3>
                                <p style={{ color: '#666' }}>{amenity.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section style={{ padding: '5rem 0', backgroundColor: '#8B4513', color: '#ffffff' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Visit Us</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        📍 Entebbe, Uganda
                    </p>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        📞 +256 XXX XXX XXX
                    </p>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                        ✉️ info@themarinastays.com
                    </p>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        Open 24/7 for your convenience
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HotelPage;
