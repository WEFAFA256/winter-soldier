import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCodeModal from './QRCodeModal';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showQRModal, setShowQRModal] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [formData, setFormData] = useState({
        serviceType: location.state?.serviceName || '',
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        specialRequests: '',
        bookingMethod: 'whatsapp'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const generateBookingId = () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `SSP-${timestamp}-${randomStr}`;
    };

    const handleSubmit = () => {
        const newBookingId = generateBookingId();
        setBookingId(newBookingId);
        
        const message = `*New Booking Request*\n\nBooking ID: ${newBookingId}\nService: ${formData.serviceType}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nSpecial Requests: ${formData.specialRequests || 'None'}`;
        
        if (formData.bookingMethod === 'whatsapp') {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/256764001922?text=${encodedMessage}`, '_blank');
        } else {
            const emailSubject = encodeURIComponent('Spa Booking Request');
            const emailBody = encodeURIComponent(message);
            window.location.href = `mailto:hello@serenityspa.com?subject=${emailSubject}&body=${emailBody}`;
        }
        
        // Show QR code modal
        setShowQRModal(true);
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        navigate('/');
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.name !== '' && formData.email !== '' && formData.phone !== '';
            case 2:
                return formData.date !== '' && formData.time !== '';
            case 3:
                return true;
            default:
                return false;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#d4ecec',
            paddingTop: '100px',
            paddingBottom: '4rem',
        }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ 
                        fontSize: '3rem', 
                        marginBottom: '1rem',
                        fontFamily: '"Times New Roman", Times, serif',
                        color: 'var(--color-primary)'
                    }}>
                        Book Your Appointment
                    </h1>
                    <p style={{ 
                        fontSize: '1.1rem',
                        color: 'var(--color-text-light)'
                    }}>
                        Complete the steps below to reserve your relaxation session
                    </p>
                </div>

                {/* Progress Steps */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: currentStep >= step ? 'var(--color-primary)' : '#fff',
                                color: currentStep >= step ? '#fff' : 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                border: '3px solid var(--color-primary)',
                                transition: 'all 0.3s ease'
                            }}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div style={{
                                    width: '60px',
                                    height: '3px',
                                    backgroundColor: currentStep > step ? 'var(--color-primary)' : '#ccc',
                                    transition: 'all 0.3s ease'
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form Card */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(300px, 1fr) 400px',
                    gap: 0
                }}
                className="booking-card"
                >
                    {/* Step 1: Contact Information */}
                    {currentStep === 1 && (
                        <>
                            <div style={{
                                animation: 'floatInUp 0.6s ease-out forwards',
                                opacity: 0,
                                padding: '3rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '10px',
                                        backgroundColor: 'var(--color-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        👤
                                    </div>
                                    <h2 style={{ 
                                        fontSize: '2rem', 
                                        marginBottom: '0',
                                        color: 'var(--color-primary)',
                                        fontFamily: '"Times New Roman", Times, serif'
                                    }}>
                                        Your Contact Details
                                    </h2>
                                </div>
                                <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
                                    Please provide your information so we can confirm your booking
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
                                        <span style={{ marginRight: '0.3rem' }}>👤</span> Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--color-primary)';
                                            e.target.style.boxShadow = '0 4px 8px rgba(26, 87, 87, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#ddd';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
                                        <span style={{ marginRight: '0.3rem' }}>✉️</span> Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--color-primary)';
                                            e.target.style.boxShadow = '0 4px 8px rgba(26, 87, 87, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#ddd';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
                                        <span style={{ marginRight: '0.3rem' }}>📱</span> Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+256 XXX XXXXXX"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--color-primary)';
                                            e.target.style.boxShadow = '0 4px 8px rgba(26, 87, 87, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#ddd';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            minHeight: '500px',
                            overflow: 'hidden'
                        }}
                        className="booking-image"
                        >
                            <div style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '2rem',
                                right: '2rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <h3 style={{ 
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-primary)',
                                    fontSize: '1.3rem'
                                }}>
                                    Welcome to Serenity Spa
                                </h3>
                                <p style={{ 
                                    margin: 0,
                                    color: 'var(--color-text-light)',
                                    fontSize: '0.95rem'
                                }}>
                                    Your journey to ultimate relaxation begins here. We're excited to serve you!
                                </p>
                            </div>
                        </div>
                    </>
                    )}

                    {/* Step 2: Schedule */}
                    {currentStep === 2 && (
                        <>
                        <div style={{
                            animation: 'floatInUp 0.6s ease-out forwards',
                            opacity: 0,
                            padding: '3rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--color-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    📅
                                </div>
                                <h2 style={{ 
                                    fontSize: '2rem', 
                                    marginBottom: '0',
                                    color: 'var(--color-primary)',
                                    fontFamily: '"Times New Roman", Times, serif'
                                }}>
                                    Choose Date & Time
                                </h2>
                            </div>
                            <p style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }}>
                                Select your preferred date and time for the session
                            </p>
                            <div style={{
                                backgroundColor: '#f0f9f9',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '2rem',
                                border: '2px solid var(--color-accent)'
                            }}>
                                <p style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                                    Selected Service: {formData.serviceType}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Preferred Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Preferred Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        placeholder="Any special requirements or preferences?"
                                        rows="4"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            minHeight: '500px',
                            overflow: 'hidden'
                        }}
                        className="booking-image"
                        >
                            <div style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '2rem',
                                right: '2rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <h3 style={{ 
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-primary)',
                                    fontSize: '1.3rem'
                                }}>
                                    {formData.serviceType}
                                </h3>
                                <p style={{ 
                                    margin: 0,
                                    color: 'var(--color-text-light)',
                                    fontSize: '0.95rem'
                                }}>
                                    Available 24/7 • Professional therapists • Premium experience
                                </p>
                            </div>
                        </div>
                    </>
                    )}

                    {/* Step 3: Confirmation Method */}
                    {currentStep === 3 && (
                        <>
                        <div style={{
                            animation: 'floatInUp 0.6s ease-out forwards',
                            opacity: 0,
                            padding: '3rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--color-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    ✉️
                                </div>
                                <h2 style={{ 
                                    fontSize: '2rem', 
                                    marginBottom: '0',
                                    color: 'var(--color-primary)',
                                    fontFamily: '"Times New Roman", Times, serif'
                                }}>
                                    Complete Your Booking
                                </h2>
                            </div>
                            <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
                                Choose your preferred method to receive booking confirmation
                            </p>
                            
                            {/* Booking Summary */}
                            <div style={{
                                backgroundColor: '#f0f9f9',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                marginBottom: '2rem',
                                border: '2px solid var(--color-accent)'
                            }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Booking Summary</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <p><strong>Service:</strong> {formData.serviceType}</p>
                                    <p><strong>Name:</strong> {formData.name}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>Phone:</strong> {formData.phone}</p>
                                    <p><strong>Date:</strong> {formData.date}</p>
                                    <p><strong>Time:</strong> {formData.time}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1.5rem',
                                        border: `2px solid ${formData.bookingMethod === 'whatsapp' ? 'var(--color-primary)' : '#ddd'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: formData.bookingMethod === 'whatsapp' ? '#f0f9f9' : 'transparent'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="bookingMethod"
                                        value="whatsapp"
                                        checked={formData.bookingMethod === 'whatsapp'}
                                        onChange={handleInputChange}
                                        style={{ marginRight: '1rem', width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
                                            WhatsApp
                                        </span>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                                            Get instant confirmation via WhatsApp
                                        </span>
                                    </div>
                                </label>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1.5rem',
                                        border: `2px solid ${formData.bookingMethod === 'email' ? 'var(--color-primary)' : '#ddd'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: formData.bookingMethod === 'email' ? '#f0f9f9' : 'transparent'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="bookingMethod"
                                        value="email"
                                        checked={formData.bookingMethod === 'email'}
                                        onChange={handleInputChange}
                                        style={{ marginRight: '1rem', width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
                                            Email
                                        </span>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                                            Receive booking details via email
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            minHeight: '500px',
                            overflow: 'hidden'
                        }}
                        className="booking-image"
                        >
                            <div style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '2rem',
                                right: '2rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <h3 style={{ 
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-primary)',
                                    fontSize: '1.3rem'
                                }}>
                                    Almost There!
                                </h3>
                                <p style={{ 
                                    margin: 0,
                                    color: 'var(--color-text-light)',
                                    fontSize: '0.95rem'
                                }}>
                                    You'll receive a QR code to present at our reception for a seamless check-in experience.
                                </p>
                            </div>
                        </div>
                    </>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '3rem',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevious}
                                className="btn-outline"
                                style={{
                                    padding: '0.8rem 2rem',
                                    fontSize: '1rem',
                                    border: '2px solid var(--color-primary)',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'inherit',
                                    fontWeight: '600',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-primary)'
                                }}
                            >
                                Previous
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!isStepValid()}
                                className="btn"
                                style={{
                                    padding: '0.8rem 2rem',
                                    fontSize: '1rem',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: isStepValid() ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'inherit',
                                    fontWeight: '600',
                                    marginLeft: 'auto',
                                    opacity: isStepValid() ? 1 : 0.5
                                }}
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="btn"
                                style={{
                                    padding: '0.8rem 2rem',
                                    fontSize: '1rem',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'inherit',
                                    fontWeight: '600',
                                    marginLeft: 'auto'
                                }}
                            >
                                Complete Booking
                            </button>
                        )}
                    </div>
            </div>

            {/* QR Code Modal */}
            <QRCodeModal
                isOpen={showQRModal}
                onClose={handleCloseQRModal}
                bookingData={{
                    bookingId: bookingId,
                    serviceType: formData.serviceType,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    date: formData.date,
                    time: formData.time,
                    specialRequests: formData.specialRequests
                }}
            />
        </div>
    );
};

export default Booking;

