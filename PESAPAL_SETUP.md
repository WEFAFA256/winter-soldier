# Pesapal Payment Setup Instructions

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
npm install
```

This will install `express` and `cors` needed for the payment server.

### Step 2: Start the Backend Server

Open a **new terminal window** and run:

```bash
npm run server
```

You should see:
```
Pesapal proxy server running on http://localhost:3001
Make sure your frontend is configured to use this server
```

**Keep this terminal open** - the server needs to keep running!

### Step 3: Start the Frontend (in another terminal)

```bash
npm run dev
```

### Step 4: Test the Payment Flow

1. Go to your booking page
2. Fill out the form
3. Click "Complete Booking"
4. Choose "Pay Online Now"
5. You should be redirected to Pesapal's payment page

---

## 🔧 How It Works

The backend server (`server.js`) acts as a proxy between your frontend and Pesapal's API. This solves the CORS (Cross-Origin Resource Sharing) issue that prevents direct API calls from the browser.

**Flow:**
1. Frontend → Backend Server → Pesapal API (Get Token)
2. Frontend → Backend Server → Pesapal API (Create Order)
3. Pesapal → Redirects user to payment page
4. User pays → Pesapal redirects back to your site

---

## 📝 Production Deployment

For production, you'll need to:

1. **Deploy the backend server** to a hosting service like:
   - Heroku
   - Railway
   - Render
   - Vercel (with serverless functions)
   - Your own server

2. **Update the backend URL** in `src/components/Booking.jsx`:
   ```javascript
   const BACKEND_URL = 'https://your-backend-url.com'; // Your deployed backend
   ```

3. **Change to live mode** in `server.js`:
   ```javascript
   const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3'; // Live mode
   ```

4. **Update credentials** - Use your live Pesapal credentials (not sandbox)

---

## ⚠️ Important Notes

- The backend server **must be running** for payments to work
- Keep the server terminal open while testing
- For production, deploy the backend to a permanent server
- Never expose your Consumer Secret in frontend code (it's safe in the backend)

---

## 🐛 Troubleshooting

**Error: "Payment server is not running"**
- Make sure you started the backend server with `npm run server`
- Check that it's running on `http://localhost:3001`

**Error: "Failed to fetch"**
- Check your internet connection
- Verify Pesapal credentials are correct
- Make sure backend server is running

**Payment page doesn't load**
- Check browser console for errors
- Verify Pesapal sandbox is accessible
- Check that callback URL is correct

---

## 📞 Need Help?

If you encounter issues:
1. Check the backend server terminal for error messages
2. Check the browser console (F12) for frontend errors
3. Verify your Pesapal credentials are correct
4. Make sure both frontend and backend are running

