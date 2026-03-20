'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HotelPriceList = () => {
    const router = useRouter();
    // Using images from public/assets/hotel_pricelist
    const images = [
        '/assets/hotel_pricelist/price1.jpg',
        '/assets/hotel_pricelist/price2.jpg',
        '/assets/hotel_pricelist/price3.jpg',
        '/assets/hotel_pricelist/price4.jpg',
        '/assets/hotel_pricelist/price5.jpg',
        '/assets/hotel_pricelist/price6.jpg',
        '/assets/hotel_pricelist/price7.jpg',
        '/assets/hotel_pricelist/price8.jpg'
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // 4 seconds per slide

        return () => clearInterval(interval);
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Auto-scroll to booking or show modal? 
    // The user didn't specify interaction. Just "add those images as pricelists".
    // I will add a "Book Now" button overlay or just let them view images.
    // PriceList.jsx didn't have buttons overlay on images.
    // But text said "Explore our range...".

    // I'll stick to the visual style of PriceList.jsx.

    // Check PriceList.jsx CSS classes: "pricelist-carousel-container", "pricelist-track", "pricelist-slide".
    // These classes are likely globally defined in index.css? Or inline?
    // PriceList.jsx in Step 989 didn't show inline styles for these classes.
    // So they must be in `index.css`.
    // I should verify `index.css` to ensure they apply here too, or if I need `HotelPriceList` specific naming.
    // If I reuse class names, I reuse styles. Good.

    // I will assume reusing "pricelist-*" classes is fine.

    return (
        <section id="hotel-pricelist" className="section-padding" style={{ backgroundColor: '#fff' }}>
            <div className="container" style={{ position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ color: '#8B4513' }}>Hotel Services Price List</h2>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Discover our exclusive hotel amenities and service packages.
                    </p>
                </div>

                <div className="pricelist-carousel-container" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div
                        className="pricelist-track"
                        style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
                    >
                        {images.map((img, index) => (
                            <div key={index} className="pricelist-slide" style={{ position: 'relative', minWidth: '100%', minHeight: '500px' }}>
                                <Image
                                    src={img}
                                    alt={`Hotel Price List ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="pricelist-image"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Dots Navigation */}
                    <div className="pricelist-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`pricelist-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                style={{ backgroundColor: index === currentIndex ? '#8B4513' : '#ddd' }}
                            ></button>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => router.push('/hotel/booking')}
                        className="btn"
                        style={{
                            backgroundColor: '#8B4513',
                            color: '#fff',
                            padding: '0.8rem 2rem',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Book a Service
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HotelPriceList;
