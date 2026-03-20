'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ServiceCard from './ServiceCard';

const HotelRoomsPage = () => {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#FAF0E6', minHeight: '100vh' }}>
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '3rem', color: '#8B4513' }}>
                        Our Rooms & Suites
                    </h2>
                    <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem', color: 'var(--color-text-light)' }}>
                        Choose from our variety of luxurious rooms designed for your comfort and relaxation.
                    </p>
                    <div className="services-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                title: 'Economy Stay',
                                image: '/assets/hotel_rooms/economy_stay.jpg',
                                description: 'Budget friendly option with essential amenities. Includes Breakfast, Room Service, and access to Foot Spa. Ideal for solo travelers.',
                                price: '30$ / UGX 100K',
                                delay: 'delay-100'
                            },
                            {
                                title: 'Deluxe Queen',
                                image: '/assets/hotel_rooms/deluxe_queen.jpg',
                                description: 'Perfect comfort & luxury. Self-contained with Queen Size Bed, Aerial & Airport View. Includes Breakfast and Spa access.',
                                price: '80$ / UGX 250K',
                                delay: 'delay-200'
                            },
                            {
                                title: 'Deluxe Twinbed',
                                image: '/assets/hotel_rooms/deluxe_twin.jpg',
                                description: 'Spacious twin bed setup. Includes all Deluxe amenities plus Music Party Free access. Great for friends or colleagues.',
                                price: '100$ / UGX 350K',
                                delay: 'delay-300'
                            },
                            {
                                title: 'Penthouse Deluxe',
                                image: '/assets/hotel_rooms/penthouse_deluxe.jpg',
                                description: 'Premium Luxury. King Size Bed, Laundry Service, and Party Free access. The ultimate experience for up to 3 adults.',
                                price: '130$ / UGX 450K',
                                delay: 'delay-100'
                            }
                        ].map((room, index) => (
                            <ServiceCard
                                key={index}
                                title={room.title}
                                image={room.image}
                                fullImage={room.image}
                                description={`${room.description} Price: ${room.price}`}
                                delay={room.delay}
                                onLearnMore={() => setSelectedImage(room.image)}
                                showBookNow={true}
                                onBookNow={() => router.push(`/hotel/booking?serviceName=${encodeURIComponent(room.title)}`)}
                                needsCrop={true}
                                customColor="#8B4513"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '1rem',
                        cursor: 'pointer'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div style={{ position: 'relative', width: '90vw', maxWidth: '1000px', height: '70vh' }}>
                        <Image
                            src={selectedImage}
                            alt="Room Detail"
                            fill
                            sizes="90vw"
                            style={{
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 5px 30px rgba(0,0,0,0.5)'
                            }}
                        />
                        <button
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '0',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '2rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelRoomsPage;
