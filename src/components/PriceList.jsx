import React, { useState, useEffect } from 'react';
import price1 from '../assets/pricelist/price1.jpg';
import price2 from '../assets/pricelist/price2.jpg';
import price3 from '../assets/pricelist/price3.jpg';
import price4 from '../assets/pricelist/price4.jpg';
import price5 from '../assets/pricelist/price5.jpg';

const PriceList = () => {
    const images = [price1, price2, price3, price4, price5];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section id="pricelist" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2>Our Price List</h2>
                    <p style={{ color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>
                        Explore our range of relaxing and therapeutic treatments.
                    </p>
                </div>

                <div className="pricelist-carousel-container">
                    <div
                        className="pricelist-track"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((img, index) => (
                            <div key={index} className="pricelist-slide">
                                <img src={img} alt={`Price List ${index + 1}`} className="pricelist-image" />
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
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PriceList;
