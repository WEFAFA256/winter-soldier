import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// PesaPal Configuration
const PESAPAL_CONSUMER_KEY = '+xu+14OnZYEzJUvRXc/944JFZzePNFcT';
const PESAPAL_CONSUMER_SECRET = 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3';

// HTTPS Agent to avoid socket hang ups
const agent = new https.Agent({
    keepAlive: true,
    family: 4 // Force IPv4
});

const APP_URL = 'http://localhost:5173'; // Frontend URL

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'PesaPal Server Running' });
});

let pesapalToken = null;
let pesapalTokenExpiry = null;

// Helper: Get PesaPal Token
const getPesapalToken = async () => {
    if (pesapalToken && pesapalTokenExpiry && new Date() < pesapalTokenExpiry) {
        return pesapalToken;
    }

    try {
        console.log('Requesting new PesaPal Token...');
        const response = await axios.post(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
            consumer_key: PESAPAL_CONSUMER_KEY,
            consumer_secret: PESAPAL_CONSUMER_SECRET
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            httpsAgent: agent
        });

        if (response.data && response.data.token) {
            pesapalToken = response.data.token;
            // Token is valid for 5 minutes usually, set expiry slightly earlier
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 4);
            pesapalTokenExpiry = expiryDate;
            console.log('PesaPal Token acquired successfully.');
            return pesapalToken;
        } else {
            throw new Error('Failed to retrieve token from PesaPal (No token in response)');
        }
    } catch (error) {
        console.error('PesaPal Auth Error:', error.response?.data || error.message);
        throw error;
    }
};

// Helper: Register IPN
const registerIPN = async (token) => {
    try {
        console.log('Registering IPN...');
        const response = await axios.post(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
            url: 'https://www.serenityspa-ug.com/api/pesapal/ipn', // Placeholder public URL
            ipn_notification_type: 'GET'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            httpsAgent: agent
        });

        console.log('IPN Registered:', response.data.ipn_id);
        return response.data.ipn_id;
    } catch (error) {
        console.error('IPN Registration Error:', error.response?.data || error.message);
        throw error;
    }
};

// Initiate PesaPal Payment
app.post('/api/pesapal/initiate', async (req, res) => {
    try {
        const { amount, email, phoneNumber, description, name } = req.body;
        console.log('Initiating Payment Request:', { amount, email, phoneNumber });

        if (!amount || !email) {
            return res.status(400).json({ error: 'Amount and Email are required' });
        }

        // 1. Authenticate
        const token = await getPesapalToken();

        // 2. Register IPN (Or get existing one)
        const ipnId = await registerIPN(token);

        // 3. Submit Order
        const orderId = uuidv4();
        const payload = {
            id: orderId,
            currency: 'UGX',
            amount: amount,
            description: description || 'Spa Service',
            callback_url: `${APP_URL}/booking?status=completed`,
            notification_id: ipnId,
            billing_address: {
                email_address: email,
                phone_number: phoneNumber || '',
                country_code: 'UG',
                first_name: name ? name.split(' ')[0] : 'Guest',
                last_name: name ? name.split(' ').slice(1).join(' ') : 'User',
                line_1: 'Serenity Spa',
                city: 'Kampala',
                state: 'Kampala',
                postal_code: '00000',
                zip_code: '00000'
            }
        };

        console.log('Submitting Order...', payload.id);
        const response = await axios.post(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            httpsAgent: agent
        });

        console.log('=== FULL PESAPAL RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
        console.log('Redirect URL:', response.data.redirect_url);
        console.log('============================');

        res.json(response.data);

    } catch (error) {
        console.error('PesaPal Initiate Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to initiate payment',
            details: error.response?.data || error.message
        });
    }
});

// Check Transaction Status
app.get('/api/pesapal/status/:orderTrackingId', async (req, res) => {
    try {
        const { orderTrackingId } = req.params;
        console.log('Checking status for:', orderTrackingId);
        const token = await getPesapalToken();

        const response = await axios.get(`${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            httpsAgent: agent
        });

        console.log('Status Response:', response.data);
        res.json(response.data);

    } catch (error) {
        console.error('Status Check Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to check status',
            details: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`PesaPal Server running on http://localhost:${PORT}`);
});
