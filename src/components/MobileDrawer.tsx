'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteContact } from './ContactProvider';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { phoneHref, phoneDisplay, whatsappLink, locationDisplay } = useSiteContact();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'VIP Packages', path: '/vip-packages' },
    { label: 'Mobile Massage', path: '/mobile-massage' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'Escorts', path: '/escorts' },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 999998,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.35s ease',
        }}
      />

      {/* Slide-out Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '85vw',
          backgroundColor: 'rgba(18, 23, 28, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderLeft: '1px solid rgba(194, 167, 78, 0.25)',
          boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.6)',
          zIndex: 999999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflowY: 'auto',
        }}
      >
        {/* Header inside drawer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link href="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/assets/logo.jpg"
              alt="The Serenity Spa"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #c2a74e',
              }}
            />
            <span style={{ fontFamily: 'Cormorant, serif', fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', letterSpacing: '1px' }}>
              SERENITY SPA
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c2a74e',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'auto' }}>
          {navLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: isActive ? '#0e1317' : '#ffffff',
                  backgroundColor: isActive ? '#c2a74e' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Contact info in sidebar */}
        <div style={{ marginTop: '30px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
            <i className="fas fa-map-marker-alt" style={{ color: '#c2a74e', marginRight: '6px' }}></i>
            {locationDisplay}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
            <i className="fas fa-clock" style={{ color: '#c2a74e', marginRight: '6px' }}></i>
            Open 24 Hours, 7 Days a Week
          </div>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
          >
            <i className="fab fa-whatsapp" style={{ fontSize: '16px' }}></i>
            WhatsApp Us
          </a>

          <a
            href={phoneHref}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(194, 167, 78, 0.4)',
              color: '#c2a74e',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            <i className="fas fa-phone-alt"></i>
            {phoneDisplay || "Call us"}
          </a>
        </div>
      </div>
    </>
  );
}
