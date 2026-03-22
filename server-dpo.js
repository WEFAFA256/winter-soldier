import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { parseStringPromise, Builder } from 'xml2js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// DPO Pay Configuration
const DPO_COMPANY_TOKEN = process.env.DPO_COMPANY_TOKEN;
const DPO_SERVICE_TYPE = process.env.DPO_SERVICE_TYPE || '3854'; 
const DPO_BASE_URL = process.env.DPO_BASE_URL || 'https://secure.3gdirectpay.com';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Verify critical environment variables
if (!DPO_COMPANY_TOKEN) {
    console.error('❌ CRITICAL ERROR: DPO_COMPANY_TOKEN is not set in environment variables!');
    console.warn('⚠️ Payments will fail until DPO_COMPANY_TOKEN is added to your .env file.');
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'DPO Pay Server Running' });
});

// Helper: Create XML for DPO API
const createDPOXML = (data) => {
    const builder = new Builder({
        xmldec: { version: '1.0', encoding: 'UTF-8' }
    });
    return builder.buildObject(data);
};

// Helper: Parse XML Response
const parseXML = async (xml) => {
    try {
        return await parseStringPromise(xml, { explicitArray: false });
    } catch (error) {
        console.error('XML Parse Error:', error);
        throw error;
    }
};

// 1. Create Payment Token
app.post('/api/dpo/initiate', async (req, res) => {
    try {
        const { amount, email, phoneNumber, description, name } = req.body;
        console.log('Initiating DPO Payment:', { amount, email, phoneNumber });

        if (!amount || !email) {
            return res.status(400).json({ error: 'Amount and Email are required' });
        }

        // Build XML request
        const xmlData = {
            API3G: {
                CompanyToken: DPO_COMPANY_TOKEN,
                Request: 'createToken',
                Transaction: {
                    PaymentAmount: amount,
                    PaymentCurrency: 'UGX',
                    CompanyRef: `SSP-${Date.now()}`,
                    RedirectURL: `${APP_URL}/booking?payment=success`,
                    BackURL: `${APP_URL}/booking?payment=cancelled`,
                    CompanyRefUnique: '0',
                    PTL: '5', // Payment Time Limit (hours)
                    PTLtype: 'hours'
                },
                Services: {
                    Service: {
                        ServiceType: DPO_SERVICE_TYPE,
                        ServiceDescription: description || 'Spa Service Booking',
                        ServiceDate: new Date().toISOString().split('T')[0]
                    }
                },
                Additional: {
                    BlockPayment: '', // Leave empty to allow all payment methods
                    customerEmail: email,
                    customerPhone: phoneNumber || '',
                    customerFirstName: name ? name.split(' ')[0] : 'Guest',
                    customerLastName: name ? name.split(' ').slice(1).join(' ') : 'User'
                }
            }
        };

        const xmlRequest = createDPOXML(xmlData);
        console.log('DPO XML Request:', xmlRequest);

        // Send request to DPO
        const response = await axios.post(
            `${DPO_BASE_URL}/API/v6/`,
            xmlRequest,
            {
                headers: {
                    'Content-Type': 'application/xml'
                }
            }
        );

        console.log('DPO Raw Response:', response.data);

        // Parse XML response
        const parsedResponse = await parseXML(response.data);
        console.log('DPO Parsed Response:', JSON.stringify(parsedResponse, null, 2));

        const apiResponse = parsedResponse.API3G;

        if (apiResponse.Result === '000') {
            // Success - return payment URL
            const transToken = apiResponse.TransToken;
            const paymentUrl = `${DPO_BASE_URL}/payv2.php?ID=${transToken}`;

            res.json({
                success: true,
                transToken: transToken,
                paymentUrl: paymentUrl,
                transRef: apiResponse.TransRef
            });
        } else {
            // Error from DPO
            throw new Error(apiResponse.ResultExplanation || 'Payment initiation failed');
        }

    } catch (error) {
        console.error('DPO Initiate Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to initiate payment',
            details: error.message
        });
    }
});

// 2. Verify Payment Status
app.get('/api/dpo/verify/:transToken', async (req, res) => {
    try {
        const { transToken } = req.params;
        console.log('Verifying DPO Transaction:', transToken);

        // Build XML request
        const xmlData = {
            API3G: {
                CompanyToken: DPO_COMPANY_TOKEN,
                Request: 'verifyToken',
                TransToken: transToken
            }
        };

        const xmlRequest = createDPOXML(xmlData);

        // Send request to DPO
        const response = await axios.post(
            `${DPO_BASE_URL}/API/v6/`,
            xmlRequest,
            {
                headers: {
                    'Content-Type': 'application/xml'
                }
            }
        );

        // Parse XML response
        const parsedResponse = await parseXML(response.data);
        console.log('DPO Verify Response:', JSON.stringify(parsedResponse, null, 2));

        const apiResponse = parsedResponse.API3G;

        res.json({
            success: apiResponse.Result === '000',
            result: apiResponse.Result,
            resultExplanation: apiResponse.ResultExplanation,
            customerName: apiResponse.CustomerName,
            customerPhone: apiResponse.CustomerPhone,
            customerEmail: apiResponse.CustomerEmail,
            transactionApproved: apiResponse.TransactionApproval === '1',
            transactionPaid: apiResponse.TransactionPaid === 'true',
            transactionAmount: apiResponse.TransactionAmount,
            transactionCurrency: apiResponse.TransactionCurrency,
            transactionRef: apiResponse.TransactionRef,
            accRef: apiResponse.AccRef
        });

    } catch (error) {
        console.error('DPO Verify Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to verify payment',
            details: error.message
        });
    }
});

// 3. Cancel Payment
app.post('/api/dpo/cancel/:transToken', async (req, res) => {
    try {
        const { transToken } = req.params;
        console.log('Cancelling DPO Transaction:', transToken);

        const xmlData = {
            API3G: {
                CompanyToken: DPO_COMPANY_TOKEN,
                Request: 'cancelToken',
                TransToken: transToken
            }
        };

        const xmlRequest = createDPOXML(xmlData);

        const response = await axios.post(
            `${DPO_BASE_URL}/API/v6/`,
            xmlRequest,
            {
                headers: {
                    'Content-Type': 'application/xml'
                }
            }
        );

        const parsedResponse = await parseXML(response.data);
        const apiResponse = parsedResponse.API3G;

        res.json({
            success: apiResponse.Result === '000',
            result: apiResponse.Result,
            resultExplanation: apiResponse.ResultExplanation
        });

    } catch (error) {
        console.error('DPO Cancel Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to cancel payment',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`DPO Pay Server running on http://localhost:${PORT}`);
    console.log(`Company Token: ${DPO_COMPANY_TOKEN === 'YOUR_DPO_COMPANY_TOKEN' ? '⚠️  NOT SET' : '✅ Configured'}`);
});
