interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  text: { body: string };
}

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private version: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.version = 'v18.0';
  }

  private async sendMessage(message: WhatsAppMessage): Promise<any> {
    const url = `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/messages`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`WhatsApp API Error: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<any> {
    // Format phone number to include country code if not present
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: `🔐 *Brij Divine Stay - OTP Verification*\n\nYour One-Time Password (OTP) is:\n\n*${otp}*\n\nPlease use this code to complete your action. For your security, do not share this code with anyone.\n\nThis code will expire in 1 minute.\n\n🏛️ *Brij Divine Stay*\nLive The Divine, Love the Stay`
      }
    };

    return this.sendMessage(message);
  }

  async sendWelcomeMessage(phoneNumber: string, userName: string): Promise<any> {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: `🎉 *Welcome to Brij Divine Stay!*\n\nDear ${userName},\n\nThank you for registering with us! Your account has been successfully created.\n\n🏛️ *Brij Divine Stay*\nLive The Divine, Love the Stay\n\nFor any assistance, feel free to contact us.`
      }
    };

    return this.sendMessage(message);
  }
}

export default new WhatsAppService(); 