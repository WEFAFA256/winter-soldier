// Vercel serverless function for Pesapal order creation
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { accessToken, orderData } = req.body;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        if (!orderData) {
            return res.status(400).json({ error: 'Order data is required' });
        }

        const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3'; // LIVE - Real payments!

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
        return res.status(200).json(data);
    } catch (error) {
        console.error('Order error:', error);
        return res.status(500).json({
            error: error.message,
            details: error.stack
        });
    }
}

