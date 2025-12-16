import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollReveal } from '../hooks/useAnimations';
import ImageModal from './ImageModal';

import ServiceCard from './ServiceCard';

const Services = () => {
    const navigate = useNavigate();
    const headerRef = useScrollAnimation('animate-float-up');
    const [modalState, setModalState] = useState({ isOpen: false, imageSrc: '', title: '' });

    const openModal = (imageSrc, title) => {
        setModalState({ isOpen: true, imageSrc, title });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, imageSrc: '', title: '' });
    };

    const handleBookNow = (serviceName) => {
        navigate('/booking', { state: { serviceName } });
    };

    // Initialize scroll reveal animations
    useScrollReveal();

    const services = [
        {
            title: 'Swedish Massage',
            image: '/assets/service1.jpg',
            fullImage: '/assets/swedish-massage-full.jpg',
            description: 'This is one of the most common & basic massage types traditionally for relaxing the mind & soothing the body. It\'s performed with slow simple calm movements to energize the body & overall health involving actions ie. Kneading, Rolling & Tapping. Oils are used.',
            delay: 'delay-100',
        },
        {
            title: 'Deeptissue Massage',
            image: '/assets/service2.jpg',
            fullImage: '/assets/deeptissue-massage-full.jpg',
            description: 'Similar to Swedish Massage, also known as Hard Massage but with a deeptissue massage, the therapist applies slow, firm pressure to release muscle tension. The focus is on the deepest layers of muscle tissue, tendons & fascia. Highly recommended for clients with body pains, aches',
            delay: 'delay-200',
        },
        {
            title: 'Aromatherapy',
            image: '/assets/service4.jpg',
            fullImage: '/assets/aromatherapy-full.jpg',
            description: 'Aromatherapy incorporates the use of warm scented essential oils into a massage while alternating between gentle and harder pressure while using a specific blend of essential oils. Highly recommended for Clients working in fumes,etc to renew the Breathe Senses & Relax',
            delay: 'delay-300',
        },
        {
            title: 'Erotic & Body to Body',
            image: '/assets/service3.jpg',
            fullImage: '/assets/erotic-massage-full.jpg',
            description: 'Definitely the most Relaxing & Sensual Massage Session combining Erotic Soothing Touches & Body 2 body Sensual Techniques of Romance. Except its more gentle & affectionate with calm relaxing touches to arouse intimacy',
            delay: 'delay-100',
        },
        {
            title: 'Xclusive Sessions',
            image: '/assets/service5.jpg',
            fullImage: '/assets/xclusive-sessions-full.jpg',
            description: 'The most sensual Erotically Satisfying Session due to the Pleasure it comes with combining B2b & Erotic Massage Techniques to arouse the Client in an immense Romantic Yoni | Tantric Feeling. It\'s inclusive of a Pack Of Extras',
            delay: 'delay-200',
        },
        {
            title: 'Turkish Bath Packages',
            image: '/assets/service6.jpg',
            fullImage: '/assets/turkish-bath-full.jpg',
            description: 'Time for Real Pampering & Soothing of that Body of Yours? Out for a 90 | 120mins Bath Session as a Spa Day Package We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-300',
        },
        {
            title: 'Body Care Packages',
            image: '/assets/service7.jpg',
            fullImage: '/assets/body-care-full.jpg',
            description: 'Got the time for Pure Relaxation & Stress Off? Out for a 120mins | 180mins Session as a Package for the Spa Day. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-100',
        },
        {
            title: 'Couples | Duo Packages',
            image: '/assets/service8.jpg',
            fullImage: '/assets/couples-duo-full.jpg',
            description: 'Got the time for Pure Relaxation & Stress Off? Out for a 90mins | 120mins Session as a Package for the Spa Day. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-200',
        },
        {
            title: 'Womens\' Packages',
            image: '/assets/service9.jpg',
            fullImage: '/assets/womens-packages-full.jpg',
            description: 'Out for a Massage Service? Planning for a 90mins | 120mins Session as a Mini Relaxation Package for the Girls Day Out. We\'ve got you covered! - Try these Massage sessions!',
            delay: 'delay-300',
        },
        // 4-Hands Services
        {
            title: '4hands Essential Oils',
            image: '/assets/4hands-essential-oils.jpg?v=3',
            fullImage: '/assets/4hands-essential-oils.jpg?v=3',
            description: 'Double the relaxation with two therapists using scented warm oils to heal mind, body, and soul. (300K)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: 'Kamasutra Session',
            image: '/assets/kamasutra-session.jpg?v=3',
            fullImage: '/assets/kamasutra-session.jpg?v=3',
            description: 'Pure intimacy and control. A distinctive session involving deep body contact, warm oils, and inverse B2B techniques. (400K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        {
            title: '4hands Nuru | B2b',
            image: '/assets/4hands-nuru-b2b.jpg?v=3',
            fullImage: '/assets/4hands-nuru-b2b.jpg?v=3',
            description: 'Experience pure arousal with two therapists. Sensual slides, sticky oils, and extreme body contact at its best. (450K)',
            delay: 'delay-300',
            needsCrop: true,
        },
        {
            title: '4hands Full Service',
            image: '/assets/4hands-full-service.jpg?v=3',
            fullImage: '/assets/4hands-full-service.jpg?v=3',
            description: 'Intense duo intimacy. Thighs, curves, and extreme contact with warm scented oils. Pure sensation. (650K)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: '4hands Tantra | Yoni',
            image: '/assets/4hands-tantra-yoni.jpg?v=3',
            fullImage: '/assets/4hands-tantra-yoni.jpg?v=3',
            description: 'Deep tantric soothing and arousal. Two therapists focus on intimate detail and pure sensation for ultimate release. (750K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        // 6-Hands & Scrubs
        {
            title: '6hands Swedish',
            image: '/assets/6hands-swedish.jpg?v=3',
            fullImage: '/assets/6hands-swedish.jpg?v=3',
            description: 'Relaxation at its Peak. Get soothed like a Baby to refresh, stress relief & re-gain focus with three therapists. (300K)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: '6hands Erotic',
            image: '/assets/6hands-erotic.jpg?v=3',
            fullImage: '/assets/6hands-erotic.jpg?v=3',
            description: 'Soothing beyond normal Erotic Sessions. Stimulate all sexual pleasures through intimate, romantic & teasing touches by three therapists. (450K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        {
            title: '6hands Full Service',
            image: '/assets/6hands-full-service.jpg?v=3',
            fullImage: '/assets/6hands-full-service.jpg?v=3',
            description: 'Combining B2b, Erotic & Aromatherapy. Unique pleasure using thighs, breasts, lips with extra body contact from three therapists. (900K)',
            delay: 'delay-300',
            needsCrop: true,
        },
        {
            title: '6hands Kamasutra',
            image: '/assets/6hands-kamasutra.jpg?v=3',
            fullImage: '/assets/6hands-kamasutra.jpg?v=3',
            description: 'Pure Romance, Erotic, and Tantric practices. Maximise the session with three therapists using extra full body contact. (1.2M)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: 'Body Scrubs',
            image: '/assets/body-scrubs.jpg?v=3',
            fullImage: '/assets/body-scrubs.jpg?v=3',
            description: 'Coffee, Salt-Based, or Moisturizing scrubs rubbed onto skin to peel dead tissue, soothing and renewing skin to full potential. (150K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        // New Services: Sports, Signature, Body Care, Nuru, Hotstone
        {
            title: 'Sports Massage',
            image: '/assets/sports-massage.jpg?v=3',
            fullImage: '/assets/sports-massage.jpg?v=3',
            description: 'More effective than Deep Tissue. Focuses on pain relief, muscle tension, and flexibility using stretching, rolling, kneading & joint cracking. (150K)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: 'Signature Massage',
            image: '/assets/signature-massage.jpg?v=3',
            fullImage: '/assets/signature-massage.jpg?v=3',
            description: 'The most relaxing and pleasing session combining Aroma, Swedish & Deep Tissue techniques for ultimate stress relief and relaxation therapy. (150K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        {
            title: 'Hotstone Massage',
            image: '/assets/hotstone-massage.jpg?v=4',
            fullImage: '/assets/hotstone-massage.jpg?v=4',
            description: 'Stone Therapy involving placement of heated basalt river rocks on the body. Allows deeper pressure without discomfort, increasing blood flow and healing. (200K)',
            delay: 'delay-300',
            needsCrop: true,
        },
        {
            title: 'B2b Nuru Massage',
            image: '/assets/b2b-nuru-massage.jpg?v=3',
            fullImage: '/assets/b2b-nuru-massage.jpg?v=3',
            description: 'Sensual massage using oiled body techniques (Breasts, Thighs) to arouse sexual feeling and intimacy. Therapist fully nude. (200K)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: 'Body Care Package',
            image: '/assets/body-care-package.jpg?v=3',
            fullImage: '/assets/body-care-package.jpg?v=3',
            description: 'Pedicure, Manicure, Full Body Waxing, Warm Towel & Relaxing Massage. Refresh, rewind & cleanse yourself in one session. (200K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        // Latest Additions: Couples, Full Service Pack, Tantra
        {
            title: 'Couples Massage',
            image: '/assets/couples-massage-flyer.jpg?v=4',
            fullImage: '/assets/couples-massage-flyer.jpg?v=4',
            description: 'Shared experience for two. Erotic/Swedish with 2 girls or 1 girl & 1 guy. A life time adventure creating memories forever. (250K)',
            delay: 'delay-300',
            needsCrop: true,
        },
        {
            title: 'Full Service Pack',
            image: '/assets/full-service-pack.jpg?v=4',
            fullImage: '/assets/full-service-pack.jpg?v=4',
            description: 'The most Sensual Erotically Satisfying Session. Combines B2b & Erotic Massage. Complete pack inclusive of Extra Services for immense Romantic Tantra Mood. (300K)',
            delay: 'delay-100',
            needsCrop: true,
        },
        {
            title: 'Tantra Massage',
            image: '/assets/tantra-massage-flyer.jpg?v=4',
            fullImage: '/assets/tantra-massage-flyer.jpg?v=4',
            description: 'Tantric Sex Practice Massage. Intensely teases client into Sensual Feeling. Therapist uses Breasts, Thighs & Soothing Hands. Not about one Orgasm but More Pleasure. (350K)',
            delay: 'delay-200',
            needsCrop: true,
        },
        // Packs (Image Only)
        {
            title: 'Affluent Body Care Pack',
            image: '/assets/affluent-collage.jpg',
            fullImage: '/assets/affluent-pack.jpg',
            description: 'Tantra Full Pack, Scrubs & Waxing, Turkish Hammam, Jacuzzi & Steam, Ped & Manicure. (600K)',
            delay: 'delay-100',
            imageOnly: true,
        },
        {
            title: 'Premium Body Care Pack',
            image: '/assets/premium-collage.jpg',
            fullImage: '/assets/premium-pack.jpg',
            description: 'Aromatherapy, Body Waxing, Steam Bath, Jacuzzi, Wines & Drinks, Ped & Manicure. (400K)',
            delay: 'delay-200',
            imageOnly: true,
        },
        {
            title: 'Classical Body Care Pack',
            image: '/assets/classical-collage.jpg',
            fullImage: '/assets/classical-pack.jpg',
            description: 'Nuru Full Pack, Waxing & Scrubs, Turkish Hammam, Foam Massage, Steam Facials, Ped & Manicure. (500K)',
            delay: 'delay-300',
            imageOnly: true,
        },
    ];

    return (
        <section id="services" className="section-padding" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="gradient-text scroll-reveal" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Services</h2>
                    <p className="scroll-reveal delay-200" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Indulge in our wide range of premium spa treatments designed to relax, renew, and revive.
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
                    {services.map((service) => (
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
