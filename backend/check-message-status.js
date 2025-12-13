// Check WhatsApp message delivery status
// Run with: node check-message-status.js

const ACCESS_TOKEN = 'EAAKGD8MNh3EBPCZBzh2XHztrv9vVACrdIWpP4g6y2xng6cRwd9uiZAZCIaQLV3b0ZAwHikYGP48JEPj3md4c4ZCC1gAJ0ZCl2nc6CeXkVR44kXrnGaQmcDM66LrikDVJfyYt2kJFd4BMpAdaexJzdOumhiadmBMC1nCBNOBIzYXSOLWkLlUnkRo50mXD39il6kKZAjBi9GZC1rldNjJQWkz7XgoNEePCGTOt9vRDNMrigiFPpetMkZALagSyhgAZDZD';
const PHONE_NUMBER_ID = '660184627187611';

async function sendMessageAndCheckStatus() {
    console.log('📱 Sending WhatsApp message and checking status...\n');

    try {
        // Step 1: Send message
        const messageData = {
            messaging_product: 'whatsapp',
            to: '+918191945008',
            type: 'text',
            text: {
                body: '🧪 Test message from Brij Divine Stay - ' + new Date().toLocaleString()
            }
        };

        console.log('1. Sending message...');
        const sendResponse = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        const sendResult = await sendResponse.json();
        console.log('Send Response:', sendResult);

        if (!sendResponse.ok) {
            console.log('❌ Failed to send message');
            return;
        }

        // Step 2: Get message ID
        const messageId = sendResult.messages[0].id;
        console.log(`✅ Message sent! ID: ${messageId}\n`);

        // Step 3: Check delivery status
        console.log('2. Checking delivery status...');
        const statusResponse = await fetch(`https://graph.facebook.com/v18.0/${messageId}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
        });

        const statusResult = await statusResponse.json();
        console.log('Status Response:', statusResult);

        if (statusResponse.ok) {
            console.log(`✅ Message status: ${statusResult.status}`);
        } else {
            console.log('❌ Failed to check status');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

sendMessageAndCheckStatus().catch(console.error); 