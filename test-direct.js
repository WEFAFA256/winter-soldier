// Direct Pesapal API test (bypassing our server) - LIVE ENVIRONMENT
// This will help us see if the credentials work directly

const testDirect = async () => {
    console.log('🔍 Testing Pesapal API Directly (LIVE ENVIRONMENT)\n');

    const PESAPAL_CONSUMER_KEY = '+xu+14OnZYEzJUvRXc/944JFZzePNFcT';
    const PESAPAL_CONSUMER_SECRET = 'bpwmC9GpZCfTCUzfInP8j3qH2U8=';
    const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3'; // LIVE

    console.log('Consumer Key:', PESAPAL_CONSUMER_KEY);
    console.log('Consumer Secret:', PESAPAL_CONSUMER_SECRET);
    console.log('Base URL:', PESAPAL_BASE_URL);
    console.log('\n───────────────────────────────────────────────\n');

    const requestBody = {
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET
    };

    console.log('Request Body:');
    console.log(JSON.stringify(requestBody, null, 2));
    console.log('\n───────────────────────────────────────────────\n');

    try {
        const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseText = await response.text();

        console.log('Response Status:', response.status);
        console.log('Response Status Text:', response.statusText);
        console.log('\nResponse Body:');
        console.log(responseText);

        try {
            const parsed = JSON.parse(responseText);
            console.log('\nParsed Response:');
            console.log(JSON.stringify(parsed, null, 2));

            if (parsed.token) {
                console.log('\n✅ SUCCESS! Token received:');
                console.log(parsed.token.substring(0, 50) + '...');
            } else if (parsed.error) {
                console.log('\n❌ ERROR from Pesapal:');
                console.log('Type:', parsed.error.error_type);
                console.log('Code:', parsed.error.code);
                console.log('Message:', parsed.error.message);
            }
        } catch (e) {
            console.log('\nCould not parse as JSON');
        }

    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }
};

testDirect();
