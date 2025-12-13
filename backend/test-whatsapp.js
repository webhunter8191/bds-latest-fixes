// Test script for WhatsApp OTP functionality
// Run with: node test-whatsapp.js

const fetch = require('node-fetch');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:7000';

async function testWhatsAppOTP() {
    console.log('🧪 Testing WhatsApp OTP functionality...\n');

    // Test 1: Send OTP via WhatsApp
    console.log('1. Testing OTP send via WhatsApp...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/otp/send-whatsapp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: '+1234567890' // Replace with your test phone number
            }),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (response.ok) {
            console.log('✅ OTP sent successfully!\n');
        } else {
            console.log('❌ Failed to send OTP:', data.message);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 2: Verify OTP
    console.log('2. Testing OTP verification...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/otp/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: '+1234567890',
                otp: '123456' // Replace with actual OTP received
            }),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (response.ok) {
            console.log('✅ OTP verified successfully!\n');
        } else {
            console.log('❌ Failed to verify OTP:', data.message);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 3: Register with phone number
    console.log('3. Testing phone registration...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register-phone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: '+1234567890',
                password: 'testpassword123',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com'
            }),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (response.ok) {
            console.log('✅ Registration successful!\n');
        } else {
            console.log('❌ Registration failed:', data.message);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('🏁 Test completed!');
}

// Check if environment variables are set
if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log('⚠️  Warning: WhatsApp environment variables not set!');
    console.log('Please set the following in your .env file:');
    console.log('- WHATSAPP_ACCESS_TOKEN');
    console.log('- WHATSAPP_PHONE_NUMBER_ID');
    console.log('\nSee WHATSAPP_SETUP.md for setup instructions.\n');
}

testWhatsAppOTP().catch(console.error); 