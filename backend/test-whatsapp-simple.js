// Simple WhatsApp test script
// Run with: node test-whatsapp-simple.js

// Your credentials
const ACCESS_TOKEN = 'EAAKGD8MNh3EBPCZBzh2XHztrv9vVACrdIWpP4g6y2xng6cRwd9uiZAZCIaQLV3b0ZAwHikYGP48JEPj3md4c4ZCC1gAJ0ZCl2nc6CeXkVR44kXrnGaQmcDM66LrikDVJfyYt2kJFd4BMpAdaexJzdOumhiadmBMC1nCBNOBIzYXSOLWkLlUnkRo50mXD39il6kKZAjBi9GZC1rldNjJQWkz7XgoNEePCGTOt9vRDNMrigiFPpetMkZALagSyhgAZDZD'; // Replace with your new token
const PHONE_NUMBER_ID = '660184627187611';

async function testWhatsAppAPI() {
    console.log('🧪 Testing WhatsApp API...\n');

    // Test 1: Check if we can access the phone number
    console.log('1. Testing phone number access...');
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
        });

        const data = await response.json();
        console.log('Phone Number Info:', data);

        if (response.ok) {
            console.log('✅ Phone number access successful!\n');
        } else {
            console.log('❌ Phone number access failed:', data);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 2: Try to send a test message
    console.log('2. Testing message sending...');
    try {
        const messageData = {
            messaging_product: 'whatsapp',
            to: '+918191945008', // Replace with your actual phone number
            type: 'text',
            text: {
                body: '🧪 Test message from Brij Divine Stay WhatsApp API'
            }
        };

        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        const data = await response.json();
        console.log('Message Response:', data);

        if (response.ok) {
            console.log('✅ Message sent successfully!\n');
        } else {
            console.log('❌ Message sending failed:', data);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('🏁 Test completed!');
}

testWhatsAppAPI().catch(console.error); 