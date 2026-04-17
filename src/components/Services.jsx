'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollReveal } from '../hooks/useAnimations';
import ImageModal from './ImageModal';

import ServiceCard from './ServiceCard';

const Services = () => {
    const router = useRouter();
    const headerRef = useScrollAnimation('animate-float-up');
    const [modalState, setModalState] = useState({ isOpen: false, imageSrc: '', title: '' });

    const openModal = (imageSrc, title) => {
        setModalState({ isOpen: true, imageSrc, title });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, imageSrc: '', title: '' });
    };

    const handleBookNow = (serviceName) => {
        router.push(`/booking?serviceName=${encodeURIComponent(serviceName)}`);
    };

    // Handle hash scrolling
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const element = document.getElementById(window.location.hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Small delay to ensure render
            }
        }
    }, []);

    // Initialize scroll reveal animations
    useScrollReveal();

    const services = [
        // --- 150K Tier ---
        {
            title: 'Swedish Massage',
            image: '/assets/service1.jpg',
            fullImage: '/assets/swedish-massage-full.jpg',
            description: 'This is one of the most common & basic massage types traditionally for relaxing the mind & soothing the body. It\'s performed with slow simple calm movements to energize the body & overall health involving actions ie. Kneading, Rolling & Tapping. Oils are used.',
            delay: 'delay-100',
            price: 150000
        },
        {
            title: 'Body Scrubs',
            image: '/assets/body-scrubs.jpg',
            fullImage: '/assets/body-scrubs.jpg',
            description: 'Coffee, Salt-Based, or Moisturizing scrubs rubbed onto skin to peel dead tissue, soothing and renewing skin to full potential. (150K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 150000
        },
        {
            title: 'Sports Massage',
            image: '/assets/sports-massage.jpg',
            fullImage: '/assets/sports-massage.jpg',
            description: 'More effective than Deep Tissue. Focuses on pain relief, muscle tension, and flexibility using stretching, rolling, kneading & joint cracking. (150K)',
            delay: 'delay-100',
            needsCrop: true,
            price: 150000
        },
        {
            title: 'Signature Massage',
            image: '/assets/signature-massage.jpg',
            fullImage: '/assets/signature-massage.jpg',
            description: 'The most relaxing and pleasing session combining Aroma, Swedish & Deep Tissue techniques for ultimate stress relief and relaxation therapy. (150K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 150000
        },
        // --- 180K Tier ---
        {
            title: 'Deeptissue Massage',
            image: '/assets/service2.jpg',
            fullImage: '/assets/deeptissue-massage-full.jpg',
            description: 'Similar to Swedish Massage, also known as Hard Massage but with a deeptissue massage, the therapist applies slow, firm pressure to release muscle tension. The focus is on the deepest layers of muscle tissue, tendons & fascia. Highly recommended for clients with body pains, aches',
            delay: 'delay-200',
            price: 180000
        },
        // --- 200K Tier ---
        {
            title: 'Aromatherapy',
            image: '/assets/service4.jpg',
            fullImage: '/assets/aromatherapy-full.jpg',
            description: 'Aromatherapy incorporates the use of warm scented essential oils into a massage while alternating between gentle and harder pressure while using a specific blend of essential oils. Highly recommended for Clients working in fumes,etc to renew the Breathe Senses & Relax',
            delay: 'delay-300',
            price: 200000
        },
        {
            title: 'Hotstone Massage',
            image: '/assets/hotstone-massage.jpg',
            fullImage: '/assets/hotstone-massage.jpg',
            description: 'Stone Therapy involving placement of heated basalt river rocks on the body. Allows deeper pressure without discomfort, increasing blood flow and healing. (200K)',
            delay: 'delay-300',
            needsCrop: true,
            price: 200000
        },
        {
            title: 'B2b Nuru Massage',
            image: '/assets/b2b-nuru-massage.jpg',
            fullImage: '/assets/b2b-nuru-massage.jpg',
            description: 'Sensual massage using oiled body techniques (Breasts, Thighs) to arouse sexual feeling and intimacy. Therapist fully nude. (200K)',
            delay: 'delay-100',
            needsCrop: true,
            price: 200000
        },
        {
            title: 'Body Care Package',
            image: '/assets/body-care-package.jpg',
            fullImage: '/assets/body-care-package.jpg',
            description: 'Pedicure, Manicure, Full Body Waxing, Warm Towel & Relaxing Massage. Refresh, rewind & cleanse yourself in one session. (200K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 200000
        },
        // --- 250K Tier ---
        {
            title: 'Erotic & Body to Body',
            image: '/assets/service3.jpg',
            fullImage: '/assets/erotic-massage-full.jpg',
            description: 'Definitely the most Relaxing & Sensual Massage Session combining Erotic Soothing Touches & Body 2 body Sensual Techniques of Romance. Except its more gentle & affectionate with calm relaxing touches to arouse intimacy',
            delay: 'delay-100',
            price: 250000
        },
        {
            title: 'Womens\' Packages',
            image: '/assets/service9.jpg',
            fullImage: '/assets/womens-packages-full.jpg',
            description: 'Out for a Massage Service? Planning for a 90mins | 120mins Session as a Mini Relaxation Package for the Girls Day Out. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-300',
            price: 250000
        },
        {
            title: 'Couples Massage',
            image: '/assets/couples-massage-flyer.jpg',
            fullImage: '/assets/couples-massage-flyer.jpg',
            description: 'Shared experience for two. Erotic/Swedish with 2 girls or 1 girl & 1 guy. A life time adventure creating memories forever. (250K)',
            delay: 'delay-300',
            needsCrop: true,
            price: 250000
        },
        // --- 300K Tier ---
        {
            title: 'Xclusive Sessions',
            image: '/assets/service5.jpg',
            fullImage: '/assets/xclusive-sessions-full.jpg',
            description: 'The most sensual Erotically Satisfying Session due to the Pleasure it comes with combining B2b & Erotic Massage Techniques to arouse the Client in an immense Romantic Yoni | Tantric Feeling. It\'s inclusive of a Pack Of Extras',
            delay: 'delay-200',
            price: 300000
        },
        {
            title: '4hands Essential Oils',
            image: '/assets/4hands-essential-oils.jpg',
            fullImage: '/assets/4hands-essential-oils.jpg',
            description: 'Double the relaxation with two therapists using scented warm oils to heal mind, body, and soul. (300K)',
            delay: 'delay-100',
            needsCrop: true,
            price: 300000
        },
        {
            title: '6hands Swedish',
            image: '/assets/6hands-swedish.jpg',
            fullImage: '/assets/6hands-swedish.jpg',
            description: 'Relaxation at its Peak. Get soothed like a Baby to refresh, stress relief & re-gain focus with three therapists. (300K)',
            delay: 'delay-100',
            needsCrop: true,
            price: 300000
        },
        {
            title: 'Full Service Pack',
            image: '/assets/full-service-pack.jpg',
            fullImage: '/assets/full-service-pack.jpg',
            description: 'The most Sensual Erotically Satisfying Session. Combines B2b & Erotic Massage. Complete pack inclusive of Extra Services for immense Romantic Tantra Mood. (300K)',
            delay: 'delay-100',
            needsCrop: true,
            price: 300000
        },
        // --- 350K Tier ---
        {
            title: 'Turkish Bath Packages',
            image: '/assets/service6.jpg',
            fullImage: '/assets/turkish-bath-full.jpg',
            description: 'Time for Real Pampering & Soothing of that Body of Yours? Out for a 90 | 120mins Bath Session as a Spa Day Package We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-300',
            price: 350000
        },
        {
            title: 'Tantra Massage',
            image: '/assets/tantra-massage-flyer.jpg',
            fullImage: '/assets/tantra-massage-flyer.jpg',
            description: 'Tantric Sex Practice Massage. Intensely teases client into Sensual Feeling. Therapist uses Breasts, Thighs & Soothing Hands. Not about one Orgasm but More Pleasure. (350K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 350000
        },
        // --- 400K Tier ---
        {
            title: 'Body Care Packages',
            image: '/assets/service7.jpg',
            fullImage: '/assets/body-care-full.jpg',
            description: 'Got the time for Pure Relaxation & Stress Off? Out for a 120mins | 180mins Session as a Package for the Spa Day. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-100',
            price: 400000
        },
        {
            title: 'Kamasutra Session',
            image: '/assets/kamasutra-session.jpg',
            fullImage: '/assets/kamasutra-session.jpg',
            description: 'Pure intimacy and control. A distinctive session involving deep body contact, warm oils, and inverse B2B techniques. (400K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 400000
        },
        {
            title: 'Premium Body Care Pack',
            image: '/assets/premium-collage.jpg',
            fullImage: '/assets/premium-pack.jpg',
            description: 'Aromatherapy, Body Waxing, Steam Bath, Jacuzzi, Wines & Drinks, Ped & Manicure. (400K)',
            delay: 'delay-200',
            imageOnly: true,
            price: 400000
        },
        // --- 450K Tier (Last Standard) ---
        {
            title: 'Couples | Duo Packages',
            image: '/assets/service8.jpg',
            fullImage: '/assets/couples-duo-full.jpg',
            description: 'Got the time for Pure Relaxation & Stress Off? Out for a 90mins | 120mins Session as a Package for the Spa Day. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-200',
            price: 450000
        },
        {
            title: '4hands Nuru | B2b',
            image: '/assets/4hands-nuru-b2b.jpg',
            fullImage: '/assets/4hands-nuru-b2b.jpg',
            description: 'Experience pure arousal with two therapists. Sensual slides, sticky oils, and extreme body contact at its best. (450K)',
            delay: 'delay-300',
            needsCrop: true,
            price: 450000
        },
        {
            title: '6hands Erotic',
            image: '/assets/6hands-erotic.jpg',
            fullImage: '/assets/6hands-erotic.jpg',
            description: 'Soothing beyond normal Erotic Sessions. Stimulate all sexual pleasures through intimate, romantic & teasing touches by three therapists. (450K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 450000
        },
        // --- VIP SERVICES > 450K ---
        {
            title: 'Classical Body Care Pack',
            image: '/assets/classical-collage.jpg',
            fullImage: '/assets/classical-pack.jpg',
            description: 'Nuru Full Pack, Waxing & Scrubs, Turkish Hammam, Foam Massage, Steam Facials, Ped & Manicure. (500K)',
            delay: 'delay-300',
            imageOnly: true,
            price: 500000
        },
        {
            title: 'Affluent Body Care Pack',
            image: '/assets/affluent-collage.jpg',
            fullImage: '/assets/affluent-pack.jpg',
            description: 'Tantra Full Pack, Scrubs & Waxing, Turkish Hammam, Jacuzzi & Steam, Ped & Manicure. (600K)',
            delay: 'delay-100',
            imageOnly: true,
            price: 600000
        },
        {
            title: '4hands Full Service',
            image: '/assets/4hands-full-service.jpg',
            fullImage: '/assets/4hands-full-service.jpg',
            description: 'Intense duo intimacy. Thighs, curves, and extreme contact with warm scented oils. Pure sensation. (650K)',
            delay: 'delay-100',
            needsCrop: true,
            price: 650000
        },
        {
            title: '4hands Tantra | Yoni',
            image: '/assets/4hands-tantra-yoni.jpg',
            fullImage: '/assets/4hands-tantra-yoni.jpg',
            description: 'Deep tantric soothing and arousal. Two therapists focus on intimate detail and pure sensation for ultimate release. (750K)',
            delay: 'delay-200',
            needsCrop: true,
            price: 750000
        },
        {
            title: '6hands Full Service',
            image: '/assets/6hands-full-service.jpg',
            fullImage: '/assets/6hands-full-service.jpg',
            description: 'Combining B2b, Erotic & Aromatherapy. Unique pleasure using thighs, breasts, lips with extra body contact from three therapists. (900K)',
            delay: 'delay-300',
            needsCrop: true,
            price: 900000
        },
        {
            title: '6hands Kamasutra',
            image: '/assets/6hands-kamasutra.jpg',
            fullImage: '/assets/6hands-kamasutra.jpg',
            description: 'Pure Romance, Erotic, and Tantric practices. Maximise the session with three therapists using extra full body contact. (1.2M)',
            delay: 'delay-100',
            needsCrop: true,
            price: 1200000
        }
    ];

    // Filter services based on price

    const standardServices = services.filter(s => s.price <= 450000).sort((a, b) => a.price - b.price);

    // Sort VIP services by price, but move specific image-only packs to the bottom
    let vipServicesRaw = services.filter(s => s.price > 450000).sort((a, b) => a.price - b.price);

    const specialPacks = ['Classical Body Care Pack', 'Affluent Body Care Pack'];
    const bottomVip = vipServicesRaw.filter(s => specialPacks.includes(s.title));
    const topVip = vipServicesRaw.filter(s => !specialPacks.includes(s.title));

    const vipServices = [...topVip, ...bottomVip];



    return (
        <section id="services" className="section-padding" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="gradient-text scroll-reveal" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Services</h2>
                    <p className="scroll-reveal delay-200" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Indulge in our wide range of premium spa treatments designed to relax, renew, and revive.
                    </p>
                </div>

                {/* Standard Services */}
                <div
                    className="services-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {standardServices.map((service) => (
                        <ServiceCard
                            key={service.title}
                            {...service}
                            onLearnMore={() => openModal(service.fullImage, service.title)}
                            showBookNow={true}
                            onBookNow={() => handleBookNow(service.title)}
                        />
                    ))}
                </div>

                {/* VIP Services */}
                {vipServices.length > 0 && (
                    <div id="vip-section" className="vip-section" style={{ marginTop: '5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 className="gradient-text-gold scroll-reveal" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>VIP & Exclusive Collections</h2>
                            <p className="scroll-reveal delay-200" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                                Premium multi-hand therapies and luxury packages for the ultimate experience.
                            </p>
                        </div>
                        <div
                            className="services-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '2rem',
                            }}
                        >
                            {vipServices.map((service) => (
                                <ServiceCard
                                    key={service.title}
                                    {...service}
                                    onLearnMore={() => openModal(service.fullImage, service.title)}
                                    showBookNow={true}
                                    onBookNow={() => handleBookNow(service.title)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ImageModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                imageSrc={modalState.imageSrc}
                title={modalState.title}
            />
        </section>
    );
};

export default Services;

