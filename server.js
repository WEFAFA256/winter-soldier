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

// Test endpoint to debug Pesapal API response
app.get('/api/pesapal/test', async (req, res) => {
    try {
        console.log('Testing Pesapal API connection...');
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
        let parsedData = null;

        try {
            parsedData = JSON.parse(responseText);
        } catch (e) {
            // Not JSON
        }

        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            rawResponse: responseText,
            parsedResponse: parsedData,
            url: `${PESAPAL_BASE_URL}/api/Auth/RequestToken`
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

// Pesapal credentials - LIVE ENVIRONMENT
const PESAPAL_CONSUMER_KEY = '+xu+14OnZYEzJUvRXc/944JFZzePNFcT';
const PESAPAL_CONSUMER_SECRET = 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3'; // LIVE - Real payments!

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
        console.log('Pesapal response headers:', Object.fromEntries(response.headers.entries()));
        console.log('Pesapal response text:', responseText);

        // Check if response indicates an error (even if status is 200)
        if (!response.ok || responseText.toLowerCase().includes('error') || responseText.toLowerCase().includes('invalid')) {
            console.error('Pesapal API error detected:', responseText);
            return res.status(response.ok ? 500 : response.status).json({
                error: responseText,
                status: response.status,
                message: 'Pesapal API returned an error'
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

        // Recursive function to find token anywhere in the object
        const findTokenRecursively = (obj, depth = 0) => {
            if (depth > 5) return null; // Prevent infinite recursion

            if (typeof obj !== 'object' || obj === null) {
                // If it's a string that looks like a token (long alphanumeric)
                if (typeof obj === 'string' && obj.length > 20 && obj.length < 500 && /^[A-Za-z0-9\-_=]+$/.test(obj)) {
                    return obj;
                }
                return null;
            }

            // Check common token field names
            const tokenFields = ['token', 'access_token', 'Token', 'AccessToken', 'accessToken', 'accessToken', 'bearer_token'];
            for (const field of tokenFields) {
                if (obj[field] && typeof obj[field] === 'string' && obj[field].length > 20) {
                    return obj[field];
                }
            }

            // Recursively search in nested objects
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const result = findTokenRecursively(obj[key], depth + 1);
                    if (result) return result;
                }
            }

            return null;
        };

        // Try to find token in various possible formats
        let token = findTokenRecursively(data);

        if (token) {
            console.log('Token found successfully:', token.substring(0, 20) + '...');
            res.json({ token: token });
        } else {
            // Log detailed information for debugging
            console.error('=== TOKEN NOT FOUND ===');
            console.error('Response status:', response.status);
            console.error('Response type:', typeof data);
            console.error('Full response object:', JSON.stringify(data, null, 2));
            console.error('Raw response text:', responseText);
            console.error('Response keys:', Object.keys(data || {}));

            // Check if this might be an error response
            const errorIndicators = ['error', 'Error', 'ERROR', 'message', 'Message', 'fail', 'Fail'];
            const hasError = errorIndicators.some(indicator =>
                (data && typeof data === 'object' && data[indicator]) ||
                responseText.includes(indicator)
            );

            if (hasError) {
                return res.status(500).json({
                    error: 'Pesapal API returned an error response',
                    details: data,
                    rawResponse: responseText,
                    message: 'Please check your Pesapal credentials and API endpoint'
                });
            }

            // Return the full response so frontend can try to extract token
            res.status(500).json({
                error: 'Token not found in Pesapal response',
                fullResponse: data,
                rawResponse: responseText,
                responseKeys: Object.keys(data || {}),
                message: 'Please check server logs for full response details. The token might be in an unexpected format.'
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

