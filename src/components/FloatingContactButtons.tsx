'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSiteContact } from './ContactProvider';

export default function FloatingContactButtons() {
  const pathname = usePathname();
  const { phoneHref, whatsappLink, emailHref, ready } = useSiteContact();

  if (!ready || pathname?.startsWith('/admin')) {
    return null;
  }

  const message = 'Hello, I would like to book a session at The Serenity Spa.';

  const socials = [
    {
      name: 'Email',
      image: '/assets/email-icon.svg',
      fallbackImg: '/assets/email-icon.png',
      url: emailHref,
      delay: '0s',
    },
    {
      name: 'WhatsApp',
      image: '/assets/whatsapp-icon.jpg',
      fallbackImg: '/assets/whatsapp-icon.jpg',
      url: whatsappLink(message),
      delay: '0.2s',
    },
    {
      name: 'Phone',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" fill="white" />
        </svg>
      ),
      url: phoneHref,
      background: '#007bff',
      delay: '0.4s',
    },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes floatBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
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
          zIndex: 99999,
          pointerEvents: 'auto',
        }}
      >
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target={social.name === 'WhatsApp' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            title={social.name}
            className="social-icon"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 0 2px rgba(194, 167, 78,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              animation: `floatBounce 2s infinite ease-in-out ${social.delay}`,
              overflow: 'hidden',
              backgroundColor: social.background || '#ffffff',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.22)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(194, 167, 78,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.4), 0 0 0 2px rgba(194, 167, 78,0.3)';
            }}
          >
            {social.icon ? (
              social.icon
            ) : (
              <img
                src={social.image}
                alt={social.name}
                style={{
                  width: social.name === 'Email' ? '65%' : '100%',
                  height: social.name === 'Email' ? '65%' : '100%',
                  objectFit: social.name === 'Email' ? 'contain' : 'cover',
                  padding: social.name === 'Email' ? '2px' : '0',
                  display: 'block',
                }}
                onError={(e) => {
                  if (social.fallbackImg) {
                    (e.target as HTMLImageElement).src = social.fallbackImg;
                  }
                }}
              />
            )}
          </a>
        ))}
      </div>
    </>
  );
}
