import React from 'react';

const spaReviews = [
    { id: 1, name: 'Sarah Jenkins', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Absolutely the best massage I have ever had. The ambiance is totally serene.' },
    { id: 2, name: 'Michael Thomas', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'The 4-hands service is worth every penny. Professional and relaxing.' },
    { id: 3, name: 'Aisha Bekele', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', text: 'A hidden gem in Kampala! The oils they use smell divine. Highly recommended.' },
    { id: 4, name: 'David Kim', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', text: 'Clean, professional, and very high-end. I felt like a VIP.' },
    { id: 5, name: 'Emily Rose', avatar: 'https://randomuser.me/api/portraits/women/90.jpg', text: 'Perfect way to unwind after a long week. The sauna is great too.' },
    { id: 6, name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: 'Experienced therapists who know exactly what they are doing.' }
];

const hotelReviews = [
    { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', text: 'The view of Lake Victoria from the room is just breathtaking.' },
    { id: 2, name: 'Lisa Ray', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', text: 'Room service was impeccable. The staff went above and beyond.' },
    { id: 3, name: 'Chris Martin', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', text: 'The Nojitos at the Oak & Tonic bar are legendary! Must try.' },
    { id: 4, name: 'Sophia L.', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', text: 'Most comfortable bed I have ever slept in. 5 stars.' },
    { id: 5, name: 'Tom Harris', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', text: 'Quiet, secure, and luxurious. The perfect weekend getaway.' },
    { id: 6, name: 'Grace M.', avatar: 'https://randomuser.me/api/portraits/women/6.jpg', text: 'Breakfast on the balcony was the highlight of my stay.' }
];

const Reviews = ({ type }) => {
    const reviews = type === 'spa' ? spaReviews : hotelReviews;
    // Duplicate reviews to create seamless loop
    const loopedReviews = [...reviews, ...reviews];

    return (
        <section className="section-padding" style={{ backgroundColor: '#f9f9f9', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
            <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="gradient-text scroll-reveal" style={{ fontSize: '2.5rem' }}>Guest Reviews</h2>
                <p className="scroll-reveal delay-200" style={{ color: '#666' }}>What our guests are saying</p>
            </div>

            <div className="reviews-marquee-container">
                <div className="reviews-track">
                    {loopedReviews.map((review, index) => (
                        <div key={`${review.id}-${index}`} className="review-card">
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C5A059' }}
                                />
                                <div style={{ marginLeft: '1rem', textAlign: 'left' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{review.name}</h4>
                                    <div style={{ color: '#C5A059', fontSize: '0.8rem' }}>★★★★★</div>
                                </div>
                            </div>
                            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                                "{review.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;

