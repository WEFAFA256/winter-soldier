# 📱 Pawapay Integration Setup

I've switched your payment integration from Pesapal to **Pawapay**, which is excellent for Mobile Money payments in Africa.

## ✅ What's Done
1. **Backend Server**: Created a new `server.js` configured for Pawapay API.
2. **Frontend**: Updated `Booking.jsx` to support Mobile Money payments.
3. **Dependencies**: Installed `axios`, `express`, `cors`, `dotenv`, `uuid`.

## 🚀 How to Finish Setup

### 1. Get Your Credentials
You need a **JWT Token** from Pawapay.
1. Log in to the [Pawapay Dashboard](https://dashboard.pawapay.cloud/).
2. Go to **Settings** > **API Keys**.
3. Generate a new token (or use an existing one).

### 2. Configure Environment
1. Open `.env.example` in your project root.
2. Copy it to a new file named `.env` (if you haven't already).
3. Paste your JWT token:
   ```env
   PAWAPAY_JWT=your_actual_jwt_token_here
   PAWAPAY_MODE=sandbox 
   # Change to 'live' when ready
   ```

### 3. Start the Server
You need to restart your backend server to pick up the changes.
```bash
npm run server
```

### 4. Test It
1. Go to your booking page.
2. Fill out the form.
3. Choose **"Pay with Mobile Money (Pawapay)"**.
4. Enter a test phone number (for sandbox) or real one (for live).
5. You should see a payment prompt on the phone!

## ⚠️ Important Notes
- **Sandbox Testing**: In sandbox mode, use specific test numbers provided in Pawapay docs to simulate success/failure.
- **Live Mode**: Ensure you switch `PAWAPAY_MODE=live` in your `.env` file before going production.
- **Currency**: Currently set to `UGX`. Change in `Booking.jsx` if needed.

## 🔄 Payment Flow
1. User clicks "Pay with Mobile Money".
2. Server calls Pawapay API (`/deposits`).
3. User receives a USSD prompt on their phone.
4. User enters PIN to approve.
5. (Optional) You can implement a webhook to auto-update status when payment completes.
