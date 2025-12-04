// Vercel serverless function for Pesapal token - LIVE ENVIRONMENT
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
        // Pesapal credentials - LIVE ENVIRONMENT (set these in Vercel environment variables)
        const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || '+xu+14OnZYEzJUvRXc/944JFZzePNFcT';
        const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
        const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3'; // LIVE - Real payments!

        console.log('Requesting token from Pesapal LIVE...');
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

        // Recursive function to find token
        const findTokenRecursively = (obj, depth = 0) => {
            if (depth > 5) return null;

            if (typeof obj !== 'object' || obj === null) {
                if (typeof obj === 'string' && obj.length > 20 && obj.length < 500 && /^[A-Za-z0-9\-_=]+$/.test(obj)) {
                    return obj;
                }
                return null;
            }

            const tokenFields = ['token', 'access_token', 'Token', 'AccessToken', 'accessToken', 'bearer_token'];
            for (const field of tokenFields) {
                if (obj[field] && typeof obj[field] === 'string' && obj[field].length > 20) {
                    return obj[field];
                }
            }

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const result = findTokenRecursively(obj[key], depth + 1);
                    if (result) return result;
                }
            }

            return null;
        };

        const token = findTokenRecursively(data);

        if (token) {
            console.log('Token found successfully');
            return res.status(200).json({ token: token });
        } else {
            console.error('Token not found. Full response:', JSON.stringify(data, null, 2));
            return res.status(500).json({
                error: 'Token not found in Pesapal response',
                fullResponse: data,
                rawResponse: responseText,
                message: 'Please check your Pesapal credentials'
            });
        }
    } catch (error) {
        console.error('Token error:', error);
        return res.status(500).json({
            error: error.message,
            details: error.stack
        });
    }
}
