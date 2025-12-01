import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
    const formRef = useScrollAnimation('animate-float-up');
    const infoRef = useScrollAnimation('animate-float-up');

    return (
        <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get in Touch</h2>
                    <p style={{ color: 'var(--color-text-light)' }}>We'd love to hear from you. Book your appointment today.</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <div ref={infoRef} className="animate-on-scroll">
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Visit Us</h4>
                                <p style={{ color: 'var(--color-text-light)' }}>123 Serenity Lane, Wellness City, WC 12345</p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Call Us</h4>
                                <p style={{ color: 'var(--color-text-light)' }}>+1 (555) 123-4567</p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Email Us</h4>
                                <p style={{ color: 'var(--color-text-light)' }}>hello@serenityspa.com</p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Opening Hours</h4>
                                <p style={{ color: 'var(--color-text-light)' }}>Mon - Fri: 9:00 AM - 8:00 PM</p>
                                <p style={{ color: 'var(--color-text-light)' }}>Sat - Sun: 10:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: '1 1 400px' }}>
                        <form ref={formRef} className="animate-on-scroll delay-200" style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                                <input type="text" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' }} placeholder="Your Name" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                                <input type="email" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' }} placeholder="Your Email" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                                <textarea rows="4" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' }} placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="btn" style={{ width: '100%', border: 'none' }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
