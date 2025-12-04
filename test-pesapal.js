// Test script to verify Pesapal integration
// Run with: node test-pesapal.js

const testPesapalConnection = async () => {
    console.log('🔍 Testing Pesapal Integration...\n');

    const BACKEND_URL = 'http://localhost:3001';

    try {
        // Test 1: Check if server is running
        console.log('1️⃣ Checking if backend server is running...');
        const healthResponse = await fetch(`${BACKEND_URL}/health`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Backend server is running');
            console.log('   Status:', healthData.status);
            console.log('   Pesapal URL:', healthData.pesapalBaseUrl);
        } else {
            console.log('❌ Backend server is not responding');
            return;
        }

        console.log('\n2️⃣ Testing Pesapal authentication...');
        const tokenResponse = await fetch(`${BACKEND_URL}/api/pesapal/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            if (tokenData.token) {
                console.log('✅ Successfully authenticated with Pesapal');
                console.log('   Token received:', tokenData.token.substring(0, 30) + '...');
                console.log('\n🎉 Pesapal integration is working correctly!');
                console.log('\n📋 Next Steps:');
                console.log('   1. Start your frontend: npm run dev');
                console.log('   2. Navigate to the booking page');
                console.log('   3. Fill out the form and test payment');
            } else {
                console.log('⚠️  Response received but no token found');
                console.log('   Response:', JSON.stringify(tokenData, null, 2));
            }
        } else {
            const errorData = await tokenResponse.json();
            console.log('❌ Failed to authenticate with Pesapal');
            console.log('   Status:', tokenResponse.status);
            console.log('   Error:', errorData);
            console.log('\n💡 Possible issues:');
            console.log('   - Check your consumer key and secret');
            console.log('   - Verify Pesapal sandbox is accessible');
            console.log('   - Check your internet connection');
        }

    } catch (error) {
        console.log('❌ Error testing Pesapal connection');
        console.log('   Error:', error.message);
        console.log('\n💡 Make sure the backend server is running:');
        console.log('   npm run server');
    }
};

// Run the test
testPesapalConnection();
