import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';

const HotelRoomsPage = () => {
    const navigate = useNavigate();

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
                                onLearnMore={() => {
                                    // Placeholder for modal logic
                                }}
                                showBookNow={true}
                                onBookNow={() => navigate('/hotel/booking', { state: { serviceName: room.title } })}
                                needsCrop={true}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HotelRoomsPage;
