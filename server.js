// Simple Express server for Pesapal payment integration
// Run with: npm run server
// Make sure to install: npm install express cors

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Pesapal Payment Proxy Server',
        status: 'running',
        endpoints: [
            'POST /api/pesapal/token - Get Pesapal access token',
            'POST /api/pesapal/order - Create Pesapal order',
            'GET /health - Health check'
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        pesapalBaseUrl: PESAPAL_BASE_URL
    });
});

// Pesapal credentials
const PESAPAL_CONSUMER_KEY = '+xu+14OnZYEzJUvRXc/944JFZzePNFCT';
const PESAPAL_CONSUMER_SECRET = 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
const PESAPAL_BASE_URL = 'https://cybqa.pesapal.com/pesapalv3'; // Sandbox

// Endpoint to get Pesapal access token
app.post('/api/pesapal/token', async (req, res) => {
    try {
        console.log('Requesting token from Pesapal...');
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

        const responseText = await response.text();
        console.log('Pesapal response status:', response.status);
        console.log('Pesapal response:', responseText);

        if (!response.ok) {
            console.error('Pesapal API error:', responseText);
            return res.status(response.status).json({ 
                error: responseText,
                status: response.status
            });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ 
                error: 'Invalid JSON response from Pesapal',
                rawResponse: responseText
            });
        }

        // Log the response structure for debugging
        console.log('Parsed response:', JSON.stringify(data, null, 2));
        
        // Ensure we return the token in a consistent format
        if (data.token) {
            res.json({ token: data.token });
        } else if (data.access_token) {
            res.json({ token: data.access_token });
        } else if (data.Token) {
            res.json({ token: data.Token });
        } else {
            console.error('Unexpected response format:', data);
            res.status(500).json({ 
                error: 'Unexpected response format from Pesapal',
                receivedData: data
            });
        }
    } catch (error) {
        console.error('Token error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

// Endpoint to create Pesapal order
app.post('/api/pesapal/order', async (req, res) => {
    try {
        const { accessToken, orderData } = req.body;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        if (!orderData) {
            return res.status(400).json({ error: 'Order data is required' });
        }

        console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

        const response = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(orderData)
        });

        const responseText = await response.text();
        console.log('Order response status:', response.status);
        console.log('Order response:', responseText);

        if (!response.ok) {
            console.error('Pesapal order API error:', responseText);
            return res.status(response.status).json({ 
                error: responseText,
                status: response.status
            });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse order JSON:', parseError);
            return res.status(500).json({ 
                error: 'Invalid JSON response from Pesapal',
                rawResponse: responseText
            });
        }

        console.log('Order created successfully:', JSON.stringify(data, null, 2));
        res.json(data);
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

app.listen(PORT, () => {
    console.log(`Pesapal proxy server running on http://localhost:${PORT}`);
    console.log('Make sure your frontend is configured to use this server');
});

