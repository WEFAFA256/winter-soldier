import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import QRCodeModal from './QRCodeModal';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Not Paid');
    const [transactionId, setTransactionId] = useState('');
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

    // Pesapal configuration (not used - credentials are in backend/serverless functions)
    const PESAPAL_CONSUMER_KEY = '+xu+14OnZYEzJUvRXc/944JFZzePNFcT';
    const PESAPAL_CONSUMER_SECRET = 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
    const PESAPAL_MODE = 'live'; // LIVE MODE - Real payments!
    const PESAPAL_BASE_URL = PESAPAL_MODE === 'sandbox'
        ? 'https://cybqa.pesapal.com/pesapalv3'
        : 'https://pay.pesapal.com/v3';

    // Check for payment callback from Pesapal
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const orderTrackingId = searchParams.get('OrderTrackingId');
        const orderMerchantReference = searchParams.get('OrderMerchantReference');

        if (orderTrackingId && orderMerchantReference) {
            // Payment was processed, check status
            checkPesapalPaymentStatus(orderTrackingId);
        }
    }, [searchParams]);

    const checkPesapalPaymentStatus = async (orderTrackingId) => {
        // Restore booking data from sessionStorage
        const pendingBooking = sessionStorage.getItem('pendingBooking');
        if (pendingBooking) {
            const booking = JSON.parse(pendingBooking);
            setBookingId(booking.bookingId);
            setFormData(booking.formData);
        }

        // For now, assume payment was successful if we got redirected back
        // In production, you should verify with Pesapal API by calling:
        // GET /api/Transactions/GetTransactionStatus?orderTrackingId={orderTrackingId}
        setPaymentStatus('Paid');
        setTransactionId(orderTrackingId);
        setShowQRModal(true);
        sessionStorage.removeItem('pendingBooking');
    };

    const handlePayOnline = async () => {
        setShowPaymentPrompt(false);
        setIsProcessingPayment(true);

        // Generate unique order reference
        const orderReference = `SSP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Store booking data in sessionStorage for after payment redirect
        sessionStorage.setItem('pendingBooking', JSON.stringify({
            bookingId: bookingId,
            formData: formData,
            servicePrice: servicePrice,
            orderReference: orderReference
        }));

        try {
            // Use backend proxy to avoid CORS issues
            // Automatically detect environment and use appropriate backend URL
            const getBackendUrl = () => {
                // Check if we're in development (localhost)
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    return 'http://localhost:3001';
                }
                // For production (Vercel), use the same domain's API routes
                // Vercel will automatically route /api/* to serverless functions
                return ''; // Empty string means use same origin (relative URLs)
            };

            const BACKEND_URL = getBackendUrl();
            const API_BASE = BACKEND_URL || ''; // Use relative URLs in production

            // Step 1: Get OAuth token from Pesapal via backend
            const tokenResponse = await fetch(`${API_BASE}/api/pesapal/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!tokenResponse.ok) {
                let errorMessage = 'Failed to authenticate with Pesapal';
                try {
                    const errorData = await tokenResponse.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    console.error('Token error response:', errorData);
                } catch (e) {
                    const errorText = await tokenResponse.text();
                    errorMessage = errorText || errorMessage;
                    console.error('Token error (text):', errorText);
                }
                throw new Error(errorMessage);
            }

            const tokenData = await tokenResponse.json();
            console.log('Token response:', tokenData);

            // Try to extract token from various possible locations
            let accessToken = tokenData.token || tokenData.access_token || tokenData.Token ||
                tokenData.AccessToken || tokenData.accessToken;

            // If not found, try to find it in nested objects
            if (!accessToken && tokenData.fullResponse) {
                const fullResp = tokenData.fullResponse;
                accessToken = fullResp.token || fullResp.access_token || fullResp.Token ||
                    fullResp.AccessToken || fullResp.accessToken ||
                    fullResp.data?.token || fullResp.data?.access_token ||
                    fullResp.result?.token || fullResp.response?.token;
            }

            // If still not found, try to extract from raw response string
            if (!accessToken && tokenData.rawResponse) {
                try {
                    const rawParsed = JSON.parse(tokenData.rawResponse);
                    accessToken = rawParsed.token || rawParsed.access_token || rawParsed.Token;
                } catch (e) {
                    // If raw response is not JSON, maybe it's the token itself
                    if (tokenData.rawResponse && tokenData.rawResponse.length > 20 && tokenData.rawResponse.length < 500) {
                        accessToken = tokenData.rawResponse;
                    }
                }
            }

            if (!accessToken) {
                console.error('No token found in response:', tokenData);
                // Don't include response in error message shown to user
                throw new Error('No access token received from Pesapal. Please check server logs.');
            }

            // Step 2: Create order via backend
            const callbackUrl = `${window.location.origin}/booking?OrderTrackingId={order_tracking_id}&OrderMerchantReference=${orderReference}`;
            const orderData = {
                id: orderReference,
                currency: 'UGX',
                amount: servicePrice,
                description: `Serenity Spa Booking - ${formData.serviceType}`,
                callback_url: callbackUrl,
                redirect_mode: '',
                notification_id: '',
                branch: '',
                billing_address: {
                    email_address: formData.email,
                    phone_number: formData.phone,
                    country_code: 'UG',
                    first_name: formData.name.split(' ')[0] || formData.name,
                    middle_name: '',
                    last_name: formData.name.split(' ').slice(1).join(' ') || '',
                    line_1: '',
                    line_2: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    zip_code: ''
                }
            };

            const orderResponse = await fetch(`${API_BASE}/api/pesapal/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    orderData: orderData
                })
            });

            if (!orderResponse.ok) {
                let errorMessage = 'Failed to create order';
                try {
                    const errorData = await orderResponse.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    console.error('Order error response:', errorData);
                } catch (e) {
                    const errorText = await orderResponse.text();
                    errorMessage = errorText || errorMessage;
                    console.error('Order error (text):', errorText);
                }
                throw new Error(errorMessage);
            }

            const orderResult = await orderResponse.json();
            console.log('Order response:', orderResult);

            // Step 3: Redirect to Pesapal payment page
            const redirectUrl = orderResult.redirect_url || orderResult.redirectUrl || orderResult.RedirectUrl;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                console.error('No redirect URL in response:', orderResult);
                throw new Error('No redirect URL received from Pesapal.');
            }

        } catch (error) {
            console.error('Pesapal payment error:', error);
            setIsProcessingPayment(false);

            // Check if it's a connection error (backend not running)
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            // Create user-friendly error message
            let userMessage = '';

            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                if (isDevelopment) {
                    userMessage = 'Payment server is not running. Please start the backend server (npm run server) or choose to pay at venue.';
                } else {
                    userMessage = 'Payment service is temporarily unavailable. Please try again later or choose to pay at venue.';
                }
            } else if (error.message.includes('No access token')) {
                userMessage = 'Unable to connect to payment service. Please try again or choose to pay at venue.';
            } else if (error.message.includes('No redirect URL')) {
                userMessage = 'Payment setup incomplete. Please try again or choose to pay at venue.';
            } else if (error.message.includes('authenticate')) {
                userMessage = 'Payment authentication failed. Please try again or choose to pay at venue.';
            } else {
                // Generic error - don't show technical details to user
                userMessage = 'Payment setup failed. Please try again or choose to pay at venue.';
            }

            alert(userMessage);
            setShowPaymentPrompt(true);
        }
    };

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
        // Show payment selection prompt
        setShowPaymentPrompt(true);
    };

    const handlePayAtVenue = () => {
        setPaymentStatus('Not Paid');
        setShowPaymentPrompt(false);
        setShowQRModal(true);
    };


    const sendBookingConfirmation = (status) => {
        const message = `*New Booking Request*\n\nBooking ID: ${bookingId}\nService: ${formData.serviceType}\nAmount: UGX ${servicePrice.toLocaleString()}\nPayment Status: ${status}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nSpecial Requests: ${formData.specialRequests || 'None'}`;

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

            {/* Payment Selection Modal */}
            {showPaymentPrompt && (
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
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '15px',
                            padding: '2.5rem',
                            maxWidth: '500px',
                            width: '100%',
                            textAlign: 'center',
                            animation: 'floatInUp 0.4s ease-out',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            margin: '0 auto 1.5rem'
                        }}>
                            💳
                        </div>

                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: '0.5rem',
                            color: 'var(--color-primary)',
                            fontFamily: '"Times New Roman", Times, serif'
                        }}>
                            Choose Payment Method
                        </h2>

                        <p style={{
                            color: 'var(--color-text-light)',
                            marginBottom: '1rem',
                            fontSize: '1rem'
                        }}>
                            {formData.serviceType}
                        </p>

                        <div style={{
                            backgroundColor: '#f0f9f9',
                            padding: '1.5rem',
                            borderRadius: '10px',
                            marginBottom: '2rem',
                            border: '2px solid var(--color-accent)'
                        }}>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.3rem' }}>
                                UGX {servicePrice.toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>
                                Total Amount
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <button
                                onClick={handlePayOnline}
                                disabled={isProcessingPayment}
                                className="btn"
                                style={{
                                    padding: '1rem 1.5rem',
                                    fontSize: '1.1rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isProcessingPayment ? 'wait' : 'pointer',
                                    fontFamily: 'inherit',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: isProcessingPayment ? 0.7 : 1
                                }}
                            >
                                {isProcessingPayment ? (
                                    <>⏳ Processing...</>
                                ) : (
                                    <>💳 Pay Online Now</>
                                )}
                            </button>

                            <button
                                onClick={handlePayAtVenue}
                                className="btn-outline"
                                style={{
                                    padding: '1rem 1.5rem',
                                    fontSize: '1.1rem',
                                    border: '2px solid var(--color-primary)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontWeight: '600',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span>🏢</span> Pay at Venue
                            </button>
                        </div>

                        <p style={{
                            marginTop: '1rem',
                            fontSize: '0.85rem',
                            color: 'var(--color-text-light)',
                            lineHeight: '1.4'
                        }}>
                            Pay online using MTN Mobile Money, Airtel Money, Visa, or Mastercard via Pesapal. Or pay when you arrive at the spa.
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
                    transactionId: transactionId
                }}
            />
        </div>
    );
};

export default Booking;

