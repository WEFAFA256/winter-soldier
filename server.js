import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Pawapay Configuration
// These should be in a .env file
const PAWAPAY_JWT = process.env.PAWAPAY_JWT || '';
const PAWAPAY_BASE_URL = process.env.PAWAPAY_MODE === 'live'
    ? 'https://api.pawapay.cloud'
    : 'https://api.sandbox.pawapay.cloud';

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Pawapay Server Running', mode: process.env.PAWAPAY_MODE || 'sandbox' });
});

// Initiate Payment (Deposit)
app.post('/api/pawapay/deposit', async (req, res) => {
    try {
        const { amount, phoneNumber, currency = 'UGX', description, email } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Generate a unique ID for this transaction
        const depositId = uuidv4();

        const payload = {
            depositId: depositId,
            amount: amount.toString(),
            currency: currency,
            correspondent: 'MTV_MOMO_UG', // Default to MTN Uganda, frontend should select
            payer: {
                type: 'MSISDN',
                address: phoneNumber
            },
            statementDescription: description || 'Spa Service'
        };

        console.log('Initiating Pawapay deposit:', payload);

        const response = await axios.post(`${PAWAPAY_BASE_URL}/deposits`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PAWAPAY_JWT}`
            }
        });

        console.log('Pawapay response:', response.data);
        res.json(response.data);

    } catch (error) {
        console.error('Pawapay Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Payment initiation failed',
            details: error.response?.data || error.message
        });
    }
});

// Check Payment Status
app.get('/api/pawapay/status/:depositId', async (req, res) => {
    try {
        const { depositId } = req.params;

        const response = await axios.get(`${PAWAPAY_BASE_URL}/deposits/${depositId}`, {
            headers: {
                'Authorization': `Bearer ${PAWAPAY_JWT}`
            }
        });

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
    console.log(`Pawapay Server running on http://localhost:${PORT}`);
});
