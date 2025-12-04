// Simple Express server for Pesapal payment integration
// Run with: npm run server
// Make sure to install: npm install express cors

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

// Pesapal credentials
const PESAPAL_CONSUMER_KEY = '+xu+14OnZYEzJUvRXc/944JFZzePNFCT';
const PESAPAL_CONSUMER_SECRET = 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
const PESAPAL_BASE_URL = 'https://cybqa.pesapal.com/pesapalv3'; // Sandbox

// Endpoint to get Pesapal access token
app.post('/api/pesapal/token', async (req, res) => {
    try {
        const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                consumer_key: PESAPAL_CONSUMER_KEY,
                consumer_secret: PESAPAL_CONSUMER_SECRET
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Token error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to create Pesapal order
app.post('/api/pesapal/order', async (req, res) => {
    try {
        const { accessToken, orderData } = req.body;

        const response = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Pesapal proxy server running on http://localhost:${PORT}`);
    console.log('Make sure your frontend is configured to use this server');
});

