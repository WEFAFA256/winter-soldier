'use client';

import React from 'react';
import Image from 'next/image';
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
            <Image quality={100} src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                }}
                className="hover-scale"
            />
        </div>
    );
};

const Gallery = () => {
    const headerRef = useScrollAnimation('animate-float-up');
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                setImages(data);
            } catch (err) {
                console.error("Failed to fetch gallery images", err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <section className="section-padding" style={{ marginTop: '80px', backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 ref={headerRef} className="animate-on-scroll" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Gallery</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Take a glimpse into our world of tranquility and meet our dedicated team of professionals.
                    </p>
                </div>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                ) : images.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No images to display.</div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                        }}
                    >
                        {images.map((img, index) => (
                            <GalleryImage key={img.id || index} {...img} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
