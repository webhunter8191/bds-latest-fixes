import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL } = process.env;

// Create transporter for email sending
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

// Send booking confirmation email to customer
export const sendBookingConfirmationToCustomer = async (
  customerEmail: string,
  bookingData: any,
  hotelData: any
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Brij Divine Stay" <${EMAIL_USER}>`,
    to: customerEmail,
    subject: "Booking Confirmation - Brij Divine Stay",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dhsycku8t/image/upload/v1753526435/logo_bds_round_uwoqmw.png" alt="Brij Divine Stay Logo" style="height: 80px; border-radius: 50%;">
          <h1 style="color: #7B3F00; margin: 10px 0;">Brij Divine Stay</h1>
          <p style="font-style: italic; color: #7B3F00; margin: 0;">Live The Divine, Love the Stay</p>
        </div>

        <div style="background: linear-gradient(135deg, #EBC486 0%, #D4AF37 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #2D241C; margin: 0; text-align: center;">🎉 Booking Confirmed!</h2>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; margin-top: 0;">Dear ${bookingData.firstName} ${bookingData.lastName},</h3>
          <p>Thank you for choosing Brij Divine Stay! Your booking has been confirmed successfully.</p>
        </div>

        <div style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; border-bottom: 2px solid #EBC486; padding-bottom: 10px;">📋 Booking Details</h3>

          <div style="display: table; width: 100%; margin-top: 15px;">
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 40%;">Hotel:</div>
              <div style="display: table-cell; padding: 8px 0;">${hotelData.name}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Location:</div>
              <div style="display: table-cell; padding: 8px 0;">${hotelData.location}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Check-in:</div>
              <div style="display: table-cell; padding: 8px 0;">${new Date(bookingData.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Check-out:</div>
              <div style="display: table-cell; padding: 8px 0;">${new Date(bookingData.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Rooms:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.rooms} (${bookingData.roomCategories})</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Phone:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.phone || 'Not provided'}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Payment Option:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.paymentOption === 'partial' ? 'Partial Payment' : 'Full Payment'}</div>
            </div>
            ${bookingData.paymentOption === 'partial' ? `<div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Amount Paid:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #28a745;">₹${bookingData.fullAmount?.toLocaleString() || '0'}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Amount Due at Check-in:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #dc3545;">₹${(bookingData.totalCost - (bookingData.fullAmount || 0)).toLocaleString()}</div>
            </div>` : ''}
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Total Amount:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #7B3F00;">₹${bookingData.totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style="background: #EBC486; color: #2D241C; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">📞 Need Help?</h3>
          <p style="margin-bottom: 0;">If you have any questions or need assistance, please don't hesitate to contact us:</p>
          <ul style="margin: 10px 0;">
            <li>Email: ${EMAIL_USER}</li>
            <li>Phone: +91 92580 10200</li>
          </ul>
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; padding-top: 20px;">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>© 2024 Brij Divine Stay – Your Trusted Brij Travel Partner</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to customer: ${customerEmail}`);
  } catch (error) {
    console.error('Error sending booking confirmation email to customer:', error);
    throw error;
  }
};

// Send booking notification email to admin
export const sendBookingNotificationToAdmin = async (
  bookingData: any,
  hotelData: any
) => {
  if (!ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Brij Divine Stay" <${EMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: "New Booking Alert - Brij Divine Stay",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dhsycku8t/image/upload/v1753526435/logo_bds_round_uwoqmw.png" alt="Brij Divine Stay Logo" style="height: 80px; border-radius: 50%;">
          <h1 style="color: #7B3F00; margin: 10px 0;">Brij Divine Stay</h1>
          <p style="font-style: italic; color: #7B3F00; margin: 0;">Live The Divine, Love the Stay</p>
        </div>

        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="margin: 0; text-align: center;">🔔 New Booking Received!</h2>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; margin-top: 0;">New booking details:</h3>
        </div>

        <div style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; border-bottom: 2px solid #EBC486; padding-bottom: 10px;">📋 Customer Information</h3>

          <div style="display: table; width: 100%; margin-top: 15px;">
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 40%;">Name:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.firstName} ${bookingData.lastName}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Email:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.email}</div>
            </div>
          </div>
        </div>

        <div style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; border-bottom: 2px solid #EBC486; padding-bottom: 10px;">🏨 Booking Details</h3>

          <div style="display: table; width: 100%; margin-top: 15px;">
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 40%;">Hotel:</div>
              <div style="display: table-cell; padding: 8px 0;">${hotelData.name}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Location:</div>
              <div style="display: table-cell; padding: 8px 0;">${hotelData.location}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Check-in:</div>
              <div style="display: table-cell; padding: 8px 0;">${new Date(bookingData.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Check-out:</div>
              <div style="display: table-cell; padding: 8px 0;">${new Date(bookingData.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Rooms:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.rooms}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Payment Option:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.paymentOption === 'partial' ? 'Partial Payment' : 'Full Payment'}</div>
            </div>
            ${bookingData.paymentOption === 'partial' ? `<div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Amount Paid Online:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #28a745;">₹${bookingData.fullAmount?.toLocaleString() || '0'}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Amount Due at Check-in:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #dc3545;">₹${(bookingData.totalCost - (bookingData.fullAmount || 0)).toLocaleString()}</div>
            </div>` : ''}
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Total Amount:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #7B3F00;">₹${bookingData.totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style="background: #EBC486; color: #2D241C; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">📞 Action Required</h3>
          <p style="margin-bottom: 0;">Please review this booking and take necessary actions:</p>
          <ul style="margin: 10px 0;">
            <li>Confirm room availability</li>
            <li>Prepare welcome package</li>
            <li>Contact customer if needed</li>
          </ul>
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; padding-top: 20px;">
          <p>This is an automated notification for new bookings.</p>
          <p>© 2024 Brij Divine Stay – Your Trusted Brij Travel Partner</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking notification email sent to admin: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Error sending booking notification email to admin:', error);
    throw error;
  }
};

// Send booking notification email to hotel owner
export const sendBookingNotificationToHotelOwner = async (
  bookingData: any,
  hotelData: any,
  hotelOwnerEmail: string
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Brij Divine Stay" <${EMAIL_USER}>`,
    to: hotelOwnerEmail,
    subject: "New Booking for Your Hotel - Brij Divine Stay",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dhsycku8t/image/upload/v1753526435/logo_bds_round_uwoqmw.png" alt="Brij Divine Stay Logo" style="height: 80px; border-radius: 50%;">
          <h1 style="color: #7B3F00; margin: 10px 0;">Brij Divine Stay</h1>
          <p style="font-style: italic; color: #7B3F00; margin: 0;">Live The Divine, Love the Stay</p>
        </div>

        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="margin: 0; text-align: center;">🏨 New Booking for ${hotelData.name}!</h2>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; margin-top: 0;">Great news! You have a new booking:</h3>
        </div>

        <div style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; border-bottom: 2px solid #EBC486; padding-bottom: 10px;">👤 Guest Information</h3>

          <div style="display: table; width: 100%; margin-top: 15px;">
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 40%;">Name:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.firstName} ${bookingData.lastName}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Email:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.email}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Phone:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.phone || 'Not provided'}</div>
            </div>
          </div>
        </div>

        <div style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2D241C; border-bottom: 2px solid #EBC486; padding-bottom: 10px;">📅 Booking Details</h3>

          <div style="display: table; width: 100%; margin-top: 15px;">
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 40%;">Hotel:</div>
              <div style="display: table-cell; padding: 8px 0;">${hotelData.name}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Location:</div>
              <div style="display: table-cell; padding: 8px 0;">${hotelData.location}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Check-in:</div>
              <div style="display: table-cell; padding: 8px 0;">${new Date(bookingData.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Check-out:</div>
              <div style="display: table-cell; padding: 8px 0;">${new Date(bookingData.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Rooms:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.rooms} (${bookingData.roomCategories})</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Payment Option:</div>
              <div style="display: table-cell; padding: 8px 0;">${bookingData.paymentOption === 'partial' ? 'Partial Payment' : 'Full Payment'}</div>
            </div>
            ${bookingData.paymentOption === 'partial' ? `<div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Amount Paid Online:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #28a745;">₹${bookingData.fullAmount?.toLocaleString() || '0'}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Amount Due at Check-in:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #dc3545;">₹${(bookingData.totalCost - (bookingData.fullAmount || 0)).toLocaleString()}</div>
            </div>` : ''}
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Total Amount:</div>
              <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #7B3F00;">₹${bookingData.totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style="background: #EBC486; color: #2D241C; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">✅ Next Steps</h3>
          <p style="margin-bottom: 0;">Please take the following actions:</p>
          <ul style="margin: 10px 0;">
            <li>Confirm room availability for the requested dates</li>
            <li>Prepare welcome amenities and room keys</li>
            <li>Contact the guest if you need additional information</li>
            <li>Update room availability in your system</li>
          </ul>
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; padding-top: 20px;">
          <p>This booking was made through the Brij Divine Stay platform.</p>
          <p>© 2024 Brij Divine Stay – Your Trusted Brij Travel Partner</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking notification email sent to hotel owner: ${hotelOwnerEmail}`);
  } catch (error) {
    console.error('Error sending booking notification email to hotel owner:', error);
    throw error;
  }
};