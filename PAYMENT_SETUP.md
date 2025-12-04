# Payment Integration Setup Guide

## 🎯 Recommended: Pesapal (Best for Uganda)

**Why Pesapal?**
- ✅ Designed for East Africa (Kenya, Uganda, Tanzania)
- ✅ Supports MTN Mobile Money & Airtel Money
- ✅ Supports Visa, Mastercard, and bank transfers
- ✅ Easy to set up
- ✅ Good documentation

### Setup Steps:

1. **Sign up at Pesapal:**
   - Go to https://www.pesapal.com
   - Click "Get Started" or "Sign Up"
   - Create a business account
   - Complete verification (usually quick)

2. **Get Your API Credentials:**
   - Login to Pesapal dashboard
   - Go to **Developers** → **API Keys**
   - Copy your **Consumer Key** and **Consumer Secret**

3. **Update the Code:**
   - Open `src/components/Booking.jsx`
   - Find lines with:
     ```javascript
     const PESAPAL_CONSUMER_KEY = 'YOUR_PESAPAL_CONSUMER_KEY';
     const PESAPAL_CONSUMER_SECRET = 'YOUR_PESAPAL_CONSUMER_SECRET';
     ```
   - Replace with your actual keys

4. **Backend Setup Required:**
   - Pesapal requires a backend endpoint to generate payment URLs
   - You'll need to create a simple API endpoint that:
     - Generates Pesapal payment URL
     - Handles payment callbacks
     - Verifies payment status

---

## 🔄 Alternative Options:

### Option 2: Stripe (International Cards Only)

**Pros:**
- ✅ Excellent developer experience
- ✅ Great documentation
- ✅ Works worldwide
- ✅ Easy React integration

**Cons:**
- ❌ Limited mobile money support in Uganda
- ❌ Mainly for card payments

**Setup:**
1. Sign up at https://stripe.com
2. Get your publishable key
3. Install: `npm install @stripe/stripe-js @stripe/react-stripe-js`
4. Update payment component

---

### Option 3: Paystack (Nigerian, Expanding)

**Pros:**
- ✅ Good for card payments
- ✅ Some mobile money support
- ✅ Easy integration

**Cons:**
- ❌ Limited Uganda mobile money
- ❌ More popular in Nigeria

---

### Option 4: Direct Mobile Money APIs

**MTN Mobile Money API:**
- Direct integration with MTN
- Requires MTN business account
- More complex setup

**Airtel Money API:**
- Direct integration with Airtel
- Requires Airtel business account
- More complex setup

---

## 🚀 Quick Start (Current Implementation)

The current code has a **simulation mode** that allows you to test the booking flow without actual payment integration.

**To test:**
1. Click "Pay Online Now"
2. The system will simulate a successful payment
3. You'll see the QR code with "Paid" status

**To go live:**
1. Choose your payment provider (Pesapal recommended)
2. Sign up and get API keys
3. Update the code with your credentials
4. Set up backend endpoints (if required)

---

## 📝 Next Steps:

1. **For Testing:** Current simulation works fine
2. **For Production:** 
   - Sign up with Pesapal (recommended)
   - Get API credentials
   - Update `Booking.jsx` with your keys
   - Set up backend payment verification endpoint

---

## 💡 Recommendation:

**Start with Pesapal** - It's the best fit for Uganda with mobile money support, and the setup process is straightforward compared to Flutterwave.

