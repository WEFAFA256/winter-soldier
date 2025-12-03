import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeModal = ({ isOpen, onClose, bookingData }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (isOpen && canvasRef.current && bookingData) {
            const bookingInfo = `SERENITY SPA - BOOKING CONFIRMATION\n\nBooking ID: ${bookingData.bookingId}\nService: ${bookingData.serviceType}\nName: ${bookingData.name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nSpecial Requests: ${bookingData.specialRequests || 'None'}`;

            QRCode.toCanvas(canvasRef.current, bookingInfo, {
                width: 250,
                margin: 1,
                color: {
                    dark: '#1a5757',
                    light: '#ffffff'
                }
            }, (error) => {
                if (error) console.error(error);
            });
        }
    }, [isOpen, bookingData]);

    if (!isOpen) return null;

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `serenity-spa-booking-${bookingData.bookingId}.png`;
        link.href = url;
        link.click();
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: '1rem',
                animation: 'fadeIn 0.3s ease-out',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    maxWidth: '500px',
                    width: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    animation: 'floatInUp 0.4s ease-out',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    margin: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: '2px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold',
                        lineHeight: 1
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-primary)';
                        e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--color-primary)';
                    }}
                >
                    ×
                </button>

                {/* Success Icon */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    margin: '0 auto 0.8rem',
                    animation: 'zoomIn 0.5s ease-out'
                }}>
                    ✓
                </div>

                <h2 style={{
                    fontSize: '1.6rem',
                    marginBottom: '0.4rem',
                    color: 'var(--color-primary)',
                    fontFamily: '"Times New Roman", Times, serif'
                }}>
                    Booking Confirmed!
                </h2>
                
                <p style={{
                    color: 'var(--color-text-light)',
                    marginBottom: '1rem',
                    fontSize: '0.95rem'
                }}>
                    Your appointment has been successfully booked.
                </p>

                {/* Booking Details */}
                <div style={{
                    backgroundColor: '#f0f9f9',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'left',
                    border: '2px solid var(--color-accent)',
                    fontSize: '0.9rem'
                }}>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Booking ID:</strong> {bookingData?.bookingId}</p>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Service:</strong> {bookingData?.serviceType}</p>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Date:</strong> {bookingData?.date}</p>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Time:</strong> {bookingData?.time}</p>
                    <p><strong>Name:</strong> {bookingData?.name}</p>
                </div>

                {/* QR Code */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'inline-block',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    marginBottom: '1rem'
                }}>
                    <canvas ref={canvasRef}></canvas>
                    <p style={{
                        marginTop: '0.8rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-light)',
                        marginBottom: '0'
                    }}>
                        Present this QR code at reception
                    </p>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '0.8rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <button
                        onClick={handleDownload}
                        className="btn"
                        style={{
                            padding: '0.7rem 1.2rem',
                            fontSize: '0.95rem',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: '600'
                        }}
                    >
                        Download QR Code
                    </button>
                    <button
                        onClick={onClose}
                        className="btn-outline"
                        style={{
                            padding: '0.7rem 1.2rem',
                            fontSize: '0.95rem',
                            border: '2px solid var(--color-primary)',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: '600',
                            backgroundColor: 'transparent',
                            color: 'var(--color-primary)'
                        }}
                    >
                        Done
                    </button>
                </div>

                {/* Additional Info */}
                <p style={{
                    marginTop: '0',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-light)',
                    lineHeight: '1.4',
                    marginBottom: '0'
                }}>
                    A confirmation has been sent to your email and WhatsApp. Please arrive 10 minutes early.
                </p>
            </div>
        </div>
    );
};

export default QRCodeModal;

