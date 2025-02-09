import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendRechargeEmail(userEmail: string) {
  try {
    const rechargeLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/recharge-credits`;
    
    await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to: userEmail,
      subject: 'Recharge Your Credits',
      html: `
        <p>Your credits are exhausted. Click the link below to recharge 5 credits:</p>
        <a href="${rechargeLink}">Recharge Credits</a>
        <p>This is a one-time recharge opportunity.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 