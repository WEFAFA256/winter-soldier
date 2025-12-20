import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ServiceCard = ({ title, image, description, delay, fullImage, onLearnMore, imageOnly, showBookNow, onBookNow, needsCrop, customColor }) => {
    const cardRef = useScrollAnimation('animate-float-up');
    const imageRef = useScrollAnimation('animate-slide-scale');
    const textRef = useScrollAnimation('animate-float-up');

    // Default primary color fallback
    const primaryColor = customColor || 'var(--color-primary)';

    // Scale up image for 'needsCrop' items to hide bottom text
    // Anchor 'right top' so the Price Tag (on Right) is preserved and K is not cut
    const baseTransform = needsCrop ? 'scale(1.35)' : 'scale(1)';
    const hoverTransform = needsCrop ? 'scale(1.45)' : 'scale(1.1)';
    const origin = needsCrop ? 'right top' : 'center center';

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
                    alt={title || "Image"}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            </div>
        );
    }

    return (
        <div
            className="service-card"
            style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                width: '100%',
                maxWidth: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div
                ref={imageRef}
                className={`animate-on-scroll ${delay} service-card-image`}
                style={{ height: '250px', overflow: 'hidden', flexShrink: 0 }}
            >
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: needsCrop ? 'right top' : 'center', /* Anchor right for price visibility */
                        transform: baseTransform,
                        transformOrigin: origin,
                        transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = hoverTransform}
                    onMouseLeave={(e) => e.target.style.transform = baseTransform}
                />
            </div>
            <div
                ref={textRef}
                className={`animate-on-scroll ${delay} service-card-content`}
                style={{ padding: '2rem', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <h3 className="service-card-title" style={{ marginBottom: '1rem', fontSize: '1.5rem', fontFamily: '"Times New Roman", Times, serif', color: primaryColor }}>{title}</h3>
                <p className="service-card-description" style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', lineHeight: '1.5', flex: 1, fontSize: '1rem' }}>{description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onLearnMore) onLearnMore();
                        }}
                        style={{ color: primaryColor, fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                        Learn More &rarr;
                    </a>
                    {showBookNow && (
                        <button
                            className="btn"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: customColor ? customColor : undefined,
                                color: customColor ? '#fff' : undefined
                            }}
                            onClick={onBookNow}
                        >
                            Book Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
