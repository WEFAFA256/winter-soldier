import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCodeModal from './QRCodeModal';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Not Paid');
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

    // Service pricing (you can adjust these)
    const servicePricing = {
        'Swedish Massage': 150000,
        'Deeptissue Massage': 180000,
        'Aromatherapy': 200000,
        'Erotic & Body to Body': 250000,
        'Xclusive Sessions': 300000,
        'Turkish Bath Packages': 350000,
        'Body Care Packages': 400000,
        'Couples | Duo Packages': 450000,
        'Womens\' Packages': 250000
    };

    const servicePrice = servicePricing[formData.serviceType] || 150000;

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

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [mobileNetwork, setMobileNetwork] = useState('MTV_MOMO_UG'); // Default to MTN

    const handleSubmit = () => {
        const newBookingId = generateBookingId();
        setBookingId(newBookingId);
        // Show payment selection prompt
        setShowPaymentPrompt(true);
    };

    const handlePayAtVenue = () => {
        setPaymentStatus('Not Paid');
        setShowPaymentPrompt(false);
        setShowQRModal(true);
    };

    // Check for DPO Pay callback
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const paymentStatus = searchParams.get('payment');
        const transToken = searchParams.get('TransactionToken');

        if (paymentStatus === 'success' && transToken) {
            // Verify payment status with DPO
            const verifyPayment = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/dpo/verify/${transToken}`);
                    const data = await response.json();

                    if (data.success && data.transactionPaid) {
                        setPaymentStatus('Paid');
                        setShowQRModal(true);
                        window.history.replaceState({}, document.title, location.pathname);
                        alert('Payment Successful! ✅');
                    } else if (data.transactionApproved) {
                        setPaymentStatus('Pending');
                        setShowQRModal(true);
                        alert('Payment is being processed. We will confirm shortly.');
                    } else {
                        setPaymentStatus('Failed');
                        alert('Payment verification failed. Please contact support.');
                    }
                } catch (error) {
                    console.error('Verification Error:', error);
                    alert('Could not verify payment. Please contact support.');
                }
            };

            verifyPayment();
        } else if (paymentStatus === 'cancelled') {
            alert('Payment was cancelled.');
        }
    }, [location]);

    const handleDPOPayment = async () => {
        setIsProcessingPayment(true);
        try {
            // 1. Initiate Payment with DPO
            const response = await fetch('http://localhost:3001/api/dpo/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: servicePrice,
                    phoneNumber: formData.phone,
                    email: formData.email,
                    name: formData.name,
                    description: `${formData.serviceType} - Serenity Spa`,
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.details || data.error || 'Payment initiation failed');
            }

            // 2. Redirect to DPO Pay
            if (data.paymentUrl) {
                console.log('Redirecting to DPO Pay:', data.paymentUrl);
                window.location.href = data.paymentUrl;
            } else {
                throw new Error('No payment URL received from DPO Pay');
            }

        } catch (error) {
            console.error('Payment Error:', error);
            alert(`Payment failed: ${error.message}`);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const sendBookingConfirmation = (status) => {
        const message = `*New Booking Request*\\n\\nBooking ID: ${bookingId}\\nService: ${formData.serviceType}\\nAmount: UGX ${servicePrice.toLocaleString()}\\nPayment Status: ${status}\\nName: ${formData.name}\\nEmail: ${formData.email}\\nPhone: ${formData.phone}\\nDate: ${formData.date}\\nTime: ${formData.time}\\nSpecial Requests: ${formData.specialRequests || 'None'}`;

        if (formData.bookingMethod === 'whatsapp') {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/256764001922?text=${encodedMessage}`, '_blank');
        } else {
            const emailSubject = encodeURIComponent('Spa Booking Request');
            const emailBody = encodeURIComponent(message);
            window.location.href = `mailto:hello@serenityspa.com?subject=${emailSubject}&body=${emailBody}`;
        }
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        // Send booking confirmation via WhatsApp/Email after QR code is shown
        sendBookingConfirmation(paymentStatus);
        // Navigate to home after a short delay to allow the WhatsApp/Email window to open
        setTimeout(() => {
            navigate('/');
        }, 500);
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

                                {/* Confirmation Method */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '1.1rem' }}>
                                        How would you like to receive your confirmation?
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            border: '2px solid',
                                            borderColor: formData.bookingMethod === 'whatsapp' ? 'var(--color-primary)' : '#ddd',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.bookingMethod === 'whatsapp' ? '#f0f9f9' : 'transparent',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <input
                                                type="radio"
                                                name="bookingMethod"
                                                value="whatsapp"
                                                checked={formData.bookingMethod === 'whatsapp'}
                                                onChange={handleInputChange}
                                                style={{ marginRight: '0.8rem', width: '20px', height: '20px' }}
                                            />
                                            <span style={{ fontSize: '1.5rem', marginRight: '0.8rem' }}>💬</span>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>WhatsApp</div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                                                    Get instant confirmation via WhatsApp
                                                </div>
                                            </div>
                                        </label>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            border: '2px solid',
                                            borderColor: formData.bookingMethod === 'email' ? 'var(--color-primary)' : '#ddd',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.bookingMethod === 'email' ? '#f0f9f9' : 'transparent',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <input
                                                type="radio"
                                                name="bookingMethod"
                                                value="email"
                                                checked={formData.bookingMethod === 'email'}
                                                onChange={handleInputChange}
                                                style={{ marginRight: '0.8rem', width: '20px', height: '20px' }}
                                            />
                                            <span style={{ fontSize: '1.5rem', marginRight: '0.8rem' }}>📧</span>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>Email</div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                                                    Receive confirmation via email
                                                </div>
                                            </div>
                                        </label>
                                    </div>
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
                                        Complete your booking and we'll send you a confirmation with all the details.
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
                    marginTop: '2rem',
                    gap: '1rem'
                }}>
                    {currentStep > 1 && (
                        <button
                            onClick={handlePrevious}
                            className="btn-outline"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                border: '2px solid var(--color-primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontWeight: '600',
                                backgroundColor: 'transparent',
                                color: 'var(--color-primary)'
                            }}
                        >
                            ← Previous
                        </button>
                    )}
                    {currentStep < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className="btn"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: isStepValid() ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                fontWeight: '600',
                                marginLeft: 'auto',
                                opacity: isStepValid() ? 1 : 0.5
                            }}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!isStepValid()}
                            className="btn"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: isStepValid() ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                fontWeight: '600',
                                marginLeft: 'auto',
                                opacity: isStepValid() ? 1 : 0.5
                            }}
                        >
                            Complete Booking
                        </button>
                    )}
                </div>
            </div>

            {/* Payment Prompt Modal */}
            {showPaymentPrompt && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(5px)'
                    }}
                    onClick={() => setShowPaymentPrompt(false)}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '15px',
                            padding: '2.5rem',
                            maxWidth: '500px',
                            width: '90%',
                            textAlign: 'center',
                            animation: 'floatInUp 0.4s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Choose Payment Method</h2>
                        <p style={{ marginBottom: '2rem', color: '#666' }}>
                            Total: <strong>UGX {servicePrice.toLocaleString()}</strong>
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={handleDPOPayment}
                                disabled={isProcessingPayment}
                                className="btn"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'var(--color-primary)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    cursor: isProcessingPayment ? 'wait' : 'pointer',
                                    opacity: isProcessingPayment ? 0.7 : 1
                                }}
                            >
                                {isProcessingPayment ? 'Redirecting to DPO Pay...' : '💳 Pay Online (Card/Mobile Money)'}
                            </button>

                            <button
                                onClick={handlePayAtVenue}
                                className="btn-outline"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '2px solid var(--color-primary)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-primary)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                🏢 Pay at Venue
                            </button>
                        </div>
                        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#888' }}>
                            Secure payments powered by DPO Pay • MTN • Airtel • Visa • Mastercard
                        </p>
                    </div>
                </div>
            )}

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
                    specialRequests: formData.specialRequests,
                    paymentStatus: paymentStatus,
                    amount: servicePrice,
                    transactionId: ''
                }}
            />
        </div>
    );
};

export default Booking;
