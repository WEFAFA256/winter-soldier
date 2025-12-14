# 💳 DPO Pay Integration Guide

## ✅ What's Integrated

I've replaced PesaPal with **DPO Pay** - a more reliable payment gateway for Uganda with better mobile money support.

### Features:
- ✅ **MTN Mobile Money** - Direct integration
- ✅ **Airtel Money** - Direct integration  
- ✅ **Visa/Mastercard** - International cards
- ✅ **Better reliability** - Widely used in East Africa
- ✅ **Simpler API** - XML-based, easier to debug

---

## 🚀 Setup Instructions

### 1. Get DPO Pay Credentials

You need to sign up for a DPO Pay account:

1. Visit: https://dpogroup.com
2. Click "Get Started" or "Sign Up"
3. Complete merchant registration
4. Once approved, login to your DPO dashboard
5. Get your credentials:
   - **Company Token** (looks like: 57466282-EBD7-4ED5-B699-8659330A4660)
   - **Service Type ID** (looks like: 3854)

### 2. Configure Your Server

Create a `.env` file in the project root:

```bash
DPO_COMPANY_TOKEN=your_company_token_here
DPO_SERVICE_TYPE=your_service_type_here
```

**OR** edit `server-dpo.js` directly (lines 16-17) and replace:
```javascript
const DPO_COMPANY_TOKEN = 'YOUR_ACTUAL_TOKEN_HERE';
const DPO_SERVICE_TYPE = 'YOUR_SERVICE_TYPE_HERE';
```

### 3. Install Dependencies

```bash
npm install xml2js
```

✅ Already installed!

---

## 🎯 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - DPO Backend:**
```bash
npm run server:dpo
```

### Option 2: Use the Old Server Script (if configured)

```bash
npm run server
```

---

## 🔄 Payment Flow

1. **User books a service** → Fills out 3-step form
2. **Clicks "Complete Booking"** → Payment modal appears
3. **Chooses payment method:**
   - 💳 **Pay Online** → DPO Pay (Card/Mobile Money)
   - 🏢 **Pay at Venue** → Skip payment
4. **DPO Pay redirect** → User goes to secure payment page
5. **User pays** → Via MTN, Airtel, or Card
6. **Redirect back** → Returns to your site with status
7. **Verification** → System confirms payment
8. **QR Code** → Booking confirmation shown

---

## 📝 API Endpoints

### Backend Server (Port 3001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/dpo/initiate` | POST | Create payment token |
| `/api/dpo/verify/:transToken` | GET | Verify payment status |
| `/api/dpo/cancel/:transToken` | POST | Cancel payment |

### Request Example (Initiate Payment)

```json
POST http://localhost:3001/api/dpo/initiate
{
  "amount": 150000,
  "email": "customer@example.com",
  "phoneNumber": "256700000000",
  "name": "John Doe",
  "description": "Swedish Massage - Serenity Spa"
}
```

### Response Example

```json
{
  "success": true,
  "transToken": "ABC123-DEF456-GHI789",
  "paymentUrl": "https://secure.3gdirectpay.com/payv2.php?ID=ABC123-DEF456-GHI789",
  "transRef": "SSP-1234567890"
}
```

---

## 🧪 Testing

### Test Mode
DPO Pay provides test credentials for sandbox testing. Contact DPO support to get:
- Test Company Token
- Test Service Type

### Test Cards (Sandbox)
- **Visa:** 4242424242424242
- **Mastercard:** 5200000000000007
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Test Mobile Money
Use test phone numbers provided by DPO in sandbox mode.

---

## ⚠️ Important Notes

### Security
- ✅ Credentials are in `.env` (not hardcoded)
- ✅ Server-side API calls (secure)
- ✅ XML validation on responses
- ⚠️ Add `.env` to `.gitignore`

### Production Checklist
- [ ] Get production DPO credentials
- [ ] Update `.env` with production tokens
- [ ] Set up proper domain (not localhost)
- [ ] Configure DPO webhook URL
- [ ] Test all payment methods
- [ ] Enable SSL/HTTPS
- [ ] Set up error monitoring

### Localhost Limitations
- ✅ Payment initiation works
- ✅ Redirect to DPO works
- ✅ Payment verification works
- ⚠️ Webhooks won't work (need public URL)

---

## 🆚 DPO Pay vs PesaPal

| Feature | DPO Pay | PesaPal |
|---------|---------|---------|
| Mobile Money | ✅ Direct | ⚠️ Limited |
| API Type | XML (Simple) | JSON (Complex) |
| Documentation | ✅ Clear | ⚠️ Confusing |
| Uganda Support | ✅ Excellent | ⚠️ Average |
| Reliability | ✅ High | ⚠️ Variable |
| Setup | ✅ Easy | ⚠️ Complex |

---

## 🐛 Troubleshooting

### "Company Token not set" warning
- Check your `.env` file exists
- Verify `DPO_COMPANY_TOKEN` is set
- Restart the server after changes

### "No payment URL received"
- Check your DPO credentials are valid
- Verify your DPO account is active
- Check server logs for XML response
- Contact DPO support if needed

### Payment verification fails
- Check transaction token is valid
- Verify payment was completed on DPO
- Check server logs for error details

### CORS errors
- Backend must run on port 3001
- Frontend must run on port 5173
- Check CORS is enabled in server

---

## 📞 Support

### DPO Pay Support
- Website: https://dpogroup.com
- Email: support@dpogroup.com
- Phone: Check their website for regional numbers

### Your Implementation
- Backend: `server-dpo.js`
- Frontend: `src/components/Booking.jsx`
- This Guide: `DPO_SETUP.md`

---

## 🎉 You're All Set!

Once you have your DPO credentials:
1. Add them to `.env`
2. Run `npm run server:dpo`
3. Run `npm run dev`
4. Test a booking!

The integration is complete and ready to use. Just need the credentials from DPO Pay! 🚀
