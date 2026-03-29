'use client';

import { usePathname } from 'next/navigation';

const SocialMediaIcons = ({ mode }) => {
    const pathname = usePathname();
    
    // Determine mode: if passed prop exists, use it. Otherwise detect from URL.
    const currentMode = mode || (pathname?.startsWith('/hotel') ? 'hotel' : 'spa');
    const isHotel = currentMode === 'hotel';
    
    const whatsappNum = isHotel ? '256758547586' : '256705657285';
    const phoneNum = isHotel ? '0742641607' : '0764001922';
    const message = isHotel ? encodeURIComponent('Hello, I would like to book a stay at The Marina Stays.') : encodeURIComponent('Hello, I would like to book a session at Serenity Spa.');

    const socials = [
        {
            name: 'Email',
            image: 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/email-icon.svg',
            url: 'mailto:marinastaysbookings@gmail.com',
            delay: '0s'
        },
        {
            name: 'WhatsApp',
            image: 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/whatsapp-icon.jpg',
            url: `https://wa.me/${whatsappNum}?text=${message}`,
            delay: '0.2s'
        },
        {
            name: 'Phone',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '22px', height: '22px' }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" fill="white" />
                </svg>
            ),
            url: `tel:${phoneNum}`,
            background: '#007bff',
            delay: '0.4s'
        },
    ];

    return (
        <div
            className="social-icons-container"
            style={{
                position: 'fixed',
                bottom: '1.5rem', 
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                zIndex: 1000,
            }}
        >
            {socials.map((social, index) => (
                <a
                    key={index}
                    href={social.url}
                    target={social.name === 'WhatsApp' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="social-icon"
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        animation: `bounce 2s infinite ${social.delay}`,
                        overflow: 'hidden',
                        backgroundColor: social.background || '#fff',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {social.icon ? social.icon : (
                        <img
                            src={social.image}
                            alt={social.name}
                            style={{
                                width: social.name === 'Email' ? '65%' : '100%',
                                height: social.name === 'Email' ? '65%' : '100%',
                                objectFit: social.name === 'Email' ? 'contain' : 'cover',
                                padding: social.name === 'Email' ? '2px' : '0',
                            }}
                        />
                    )}
                </a>
            ))}
        </div>
    );
};

export default SocialMediaIcons;
