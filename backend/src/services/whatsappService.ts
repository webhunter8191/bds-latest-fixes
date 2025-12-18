import axios from 'axios';

const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

export class WhatsAppService {
  private static readonly BASE_URL = 'https://graph.facebook.com/v22.0';

  static async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const templateSuccess = await this.sendOTPTemplate(phoneNumber, otp);

    if (templateSuccess) {
      return true;
    }

    return await this.sendOTPTextMessage(phoneNumber, otp);
  }

  static async sendOTPTextMessage(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        return false;
      }

      const url = `${this.BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: `🔐 *Brij Divine Stay* - OTP Verification\n\nYour OTP code is: *${otp}*\n\n⏰ This code will expire in 5 minutes\n🔒 Please do not share this code with anyone\n\nThank you for choosing Brij Divine Stay! 🏨`
        }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error: any) {
      return false;
    }
  }

  static async sendOTPTemplate(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const url = `${this.BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: 'hello_world',
          language: {
            code: 'en_US'
          }
        }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error: any) {
      return false;
    }
  }

  static formatPhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('0')) {
      cleaned = '91' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    return cleaned;
  }
}