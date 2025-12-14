# 💳 PesaPal Integration Setup

I've integrated **PesaPal** into your booking system.

## ✅ What's Done
1. **Backend Server**: Updated `server.js` with PesaPal API 3.0 endpoints (Auth, Register IPN, Submit Order, Status Check).
2. **Frontend**: Updated `Booking.jsx` to initiate PesaPal payments and handle callbacks.
3. **Configuration**: Added your PesaPal keys to the server configuration.

## 🚀 Usage

### 1. Backend Server
The backend server must be running to handle PesaPal requests.
```bash
npm run server
```

### 2. Frontend
Run the frontend as usual:
```bash
npm run dev
```

## 🔄 Payment Flow
1. User fills booking form and clicks "Pay with PesaPal".
2. System initiates payment request to PesaPal.
3. User is redirected to PesaPal's secure payment page.
4. User completes payment.
5. PesaPal redirects user back to your site (`/booking?status=completed...`).
6. System verifies the transaction status and shows success message.

## ⚠️ Important
- Currently, the keys are hardcoded in `server.js` for quick setup as requested. **For production security, please move them to a `.env` file.**
- PesaPal Instant Payment Notification (IPN) requires a public URL. Since you are running on localhost, the IPN registration uses a placeholder. The primary payment verification currently relies on the redirect callback and manual status query.
