// Enhanced test script to see detailed Pesapal response
// Run with: node test-pesapal-detailed.js

const testPesapalDetailed = async () => {
    console.log('🔍 Detailed Pesapal Integration Test\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const BACKEND_URL = 'http://localhost:3001';

    try {
        console.log('📡 Testing Pesapal API directly...\n');

        const tokenResponse = await fetch(`${BACKEND_URL}/api/pesapal/test`);
        const result = await tokenResponse.json();

        console.log('Response Status:', result.status);
        console.log('Response Status Text:', result.statusText);
        console.log('\n📋 Response Headers:');
        console.log(JSON.stringify(result.headers, null, 2));
        console.log('\n📄 Raw Response from Pesapal:');
        console.log(result.rawResponse);
        console.log('\n📦 Parsed Response:');
        console.log(JSON.stringify(result.parsedResponse, null, 2));

        if (result.parsedResponse && result.parsedResponse.error) {
            console.log('\n❌ Error Details:');
            console.log('   Error Type:', result.parsedResponse.error.error_type || 'N/A');
            console.log('   Error Code:', result.parsedResponse.error.code || 'N/A');
            console.log('   Error Message:', result.parsedResponse.error.message || 'N/A');
            console.log('   Description:', result.parsedResponse.error.description || 'N/A');
        }

        console.log('\n═══════════════════════════════════════════════════════════');

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
};

testPesapalDetailed();
