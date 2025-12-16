import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
    const formRef = useScrollAnimation('animate-float-up');
    const infoRef = useScrollAnimation('animate-float-up');
    const mapRef = useScrollAnimation('animate-scale-in');

    return (
        <section id="contact" style={{
            backgroundColor: '#f8fbfc',
            paddingTop: '6rem',
            paddingBottom: '6rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(26, 87, 87, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(26, 87, 87, 0.05) 0%, transparent 20%)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        fontFamily: '"Times New Roman", Times, serif',
                        color: 'var(--color-primary)'
                    }}>
                        Get in Touch
                    </h2>
                    <p style={{
                        color: 'var(--color-text-light)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        We'd love to hear from you. Visit our sanctuary or book your appointment today.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Contact Info & Map */}
                    <div ref={infoRef} className="animate-on-scroll">
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            marginBottom: '2rem'
                        }}>
                            {/* Map Section */}
                            <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                                <iframe
                                    src="https://maps.google.com/maps?q=0.326564,32.564663&z=16&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Serenity Spa Location"
                                ></iframe>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1rem',
                                    right: '1rem',
                                    backgroundColor: '#fff',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '50px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    fontWeight: 'bold',
                                    color: 'var(--color-primary)',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=0.326564,32.564663', '_blank')}
                                >
                                    📍 Get Directions
                                </div>
                            </div>

                            <div style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'start', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: 'var(--color-secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        marginRight: '1.5rem',
                                        fontSize: '1.5rem',
                                        color: 'var(--color-primary)'
                                    }}>
                                        📍
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Visit Our Sanctuary</h4>
                                        <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                            Makerere Hill Road, Kiyindi, 2 Close<br />
                                            Kampala, Uganda
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'start', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: 'var(--color-secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        marginRight: '1.5rem',
                                        fontSize: '1.5rem',
                                        color: 'var(--color-primary)'
                                    }}>
                                        📞
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Call Us Anytime</h4>
                                        <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                            <a href="tel:0764001922" style={{ color: 'inherit', textDecoration: 'none' }}>0764 001922</a>
                                            <br />
                                            <span style={{ fontSize: '0.9rem', color: '#888' }}>Available 24/7 for bookings</span>
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'start' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: 'var(--color-secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        marginRight: '1.5rem',
                                        fontSize: '1.5rem',
                                        color: 'var(--color-primary)'
                                    }}>
                                        📧
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Email Us</h4>
                                        <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                            <a href="mailto:hello@serenityspa.com" style={{ color: 'inherit', textDecoration: 'none' }}>hello@serenityspa.com</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div ref={formRef} className="animate-on-scroll delay-200">
                        <form style={{
                            backgroundColor: '#fff',
                            padding: '3rem',
                            borderRadius: '15px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                        }}>
                            <h3 style={{ marginBottom: '2rem', color: 'var(--color-primary)', fontFamily: '"Times New Roman", Times, serif' }}>Send us a Message</h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Your Name</label>
                                <input
                                    type="text"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        backgroundColor: '#f9f9f9',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="Enter your name"
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.borderColor = 'var(--color-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--color-secondary)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = '#f9f9f9';
                                        e.target.style.borderColor = '#eee';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Email Address</label>
                                <input
                                    type="email"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        backgroundColor: '#f9f9f9',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="your.email@example.com"
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.borderColor = 'var(--color-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--color-secondary)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = '#f9f9f9';
                                        e.target.style.borderColor = '#eee';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Your Message</label>
                                <textarea
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        backgroundColor: '#f9f9f9',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="How can we help you?"
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.borderColor = 'var(--color-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--color-secondary)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = '#f9f9f9';
                                        e.target.style.borderColor = '#eee';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    padding: '1rem',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
