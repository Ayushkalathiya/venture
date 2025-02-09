import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Add verification step
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export async function sendRechargeEmail(userEmail: string, type: 'request' | 'confirmation' | 'support' = 'request', credits?: number) {
  try {
    if (!process.env.SUPPORT_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Email configuration missing');
    }
    
    const rechargeLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/recharge-credits`;
    
    let subject = '';
    let content = '';

    switch (type) {
      case 'confirmation':
        subject = 'VentureWave - Credits Recharged Successfully';
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">Credits Recharged Successfully!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
              Your VentureWave credits have been successfully recharged. You now have ${credits} credits available.
            </p>

            <div style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/home" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Searching Now
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              Thank you for using VentureWave. If you need any assistance, please don't hesitate to contact our support team.
            </p>
          </div>
        `;
        break;

      case 'support':
        subject = 'VentureWave - Contact Support for Additional Credits';
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">Need More Credits?</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
              You've already used your one-time recharge opportunity. To get additional credits, please contact our support team.
            </p>

            <div style="margin: 30px 0;">
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                Email us at: ${process.env.SUPPORT_EMAIL}
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              We'll be happy to help you continue using VentureWave's services.
            </p>
          </div>
        `;
        break;

      default: // request
        subject = 'VentureWave - Recharge Your Credits';
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">VentureWave Credit Recharge</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
              Your credits have been exhausted. You can recharge 5 credits using your one-time recharge opportunity.
            </p>

            <div style="margin: 30px 0;">
              <a href="${rechargeLink}" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Recharge Credits Now
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              Note: This is a one-time recharge opportunity. If you need additional credits after using this recharge, 
              please contact our support team.
            </p>
          </div>
        `;
    }

    await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to: userEmail,
      subject,
      html: content,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 