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
            image: 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets/assets/phone-icon.jpg',
            url: `tel:${phoneNum}`,
            delay: '0.4s'
        },
    ];

    return (
        <div
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
                        backgroundColor: '#fff',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <img
                        src={social.image}
                        alt={social.name}
                        style={{
                            width: social.name === 'Email' ? '75%' : '100%',
                            height: social.name === 'Email' ? '75%' : '100%',
                            objectFit: social.name === 'Email' ? 'contain' : 'cover',
                        }}
                    />
                </a>
            ))}
        </div>
    );
};

export default SocialMediaIcons;
