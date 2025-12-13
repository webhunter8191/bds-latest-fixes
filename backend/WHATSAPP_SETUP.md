# WhatsApp Business API Setup Guide

## Prerequisites

1. Meta Developer Account (https://developers.facebook.com/)
2. WhatsApp Business API access
3. A verified phone number for your business

## Setup Steps

### 1. Meta Developer Console Setup

1. Go to https://developers.facebook.com/
2. Create a new app or use existing app
3. Add WhatsApp product to your app
4. Configure WhatsApp Business API

### 2. Get Required Credentials

1. **Access Token**:

   - Go to your app dashboard
   - Navigate to WhatsApp > Getting Started
   - Copy your access token

2. **Phone Number ID**:
   - In WhatsApp > Getting Started
   - Find your phone number ID (usually starts with numbers)

### 3. Environment Variables

Add these to your `.env` file:

```env
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
```

### 4. Phone Number Format

- Use international format: `+1234567890`
- Include country code
- No spaces or special characters

### 5. Testing

1. Start your backend server
2. Use the `/api/otp/send-whatsapp` endpoint
3. Send a POST request with:
   ```json
   {
     "phoneNumber": "+1234567890"
   }
   ```

### 6. API Endpoints

#### Send OTP via WhatsApp

```
POST /api/otp/send-whatsapp
Body: { "phoneNumber": "+1234567890" }
```

#### Verify OTP

```
POST /api/otp/verify
Body: { "phoneNumber": "+1234567890", "otp": "123456" }
```

#### Register with Phone

```
POST /api/auth/register-phone
Body: {
  "phoneNumber": "+1234567890",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "optional@email.com"
}
```

#### Login with Phone

```
POST /api/auth/login-phone
Body: {
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

## Troubleshooting

### Common Issues:

1. **Invalid Access Token**: Ensure your token is valid and has proper permissions
2. **Phone Number Format**: Must be in international format with country code
3. **Rate Limiting**: WhatsApp has rate limits, implement proper error handling
4. **Template Messages**: For production, you may need to use message templates

### Error Responses:

- `400`: Invalid phone number or missing parameters
- `500`: WhatsApp API error or server error
- Check console logs for detailed error messages

## Security Notes

- Never expose your access token in client-side code
- Implement rate limiting for OTP requests
- Validate phone numbers on both client and server
- Use HTTPS in production
