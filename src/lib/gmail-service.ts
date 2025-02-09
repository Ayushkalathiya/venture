import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import  db  from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth.options';


export async function getGmailClient() {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function sendRechargeEmail(userEmail: string) {
  try {
    const gmail = await getGmailClient();

    const message = {
      to: userEmail,
      subject: 'Recharge Your Credits',
      text: `Your credits are exhausted. To recharge, please send a new email to ${process.env.SUPPORT_EMAIL} with the subject "recharge 5 credits".`,
    };

    const encodedMessage = Buffer.from(
      `To: ${message.to}\r\n` +
      `Subject: ${message.subject}\r\n` +
      `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
      `${message.text}`
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export async function checkRechargeEmails() {
  try {
    // Set up Gmail API with OAuth2
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Search for emails with subject "recharge 5 credits"
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:"recharge 5 credits" newer_than:1d',
    });

    const messages = response.data.messages || [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
      });

      const headers = email.data.payload?.headers;
      const from = headers?.find(h => h.name === 'From')?.value || '';
      const userEmail = from.match(/<(.+)>/)?.[1] || from;

      // Check if user exists and hasn't recharged before
      const user = await db.user.findUnique({
        where: { email: userEmail },
      });

      if (user) {
        if (!user.hasRecharged) {
          // Update credits and mark as recharged
          await db.user.update({
            where: { id: user.id },
            data: {
              credits: { increment: 5 },
              hasRecharged: true,
            },
          });

          // Send confirmation email
          await sendRechargeEmail(userEmail);
        } else {
          // Send rejection email for second attempt
          await sendRechargeEmail(userEmail);
        }
      }

      // Mark email as processed
      await gmail.users.messages.modify({
        userId: 'me',
        id: message.id!,
        requestBody: {
          addLabelIds: ['PROCESSED'],
          removeLabelIds: ['INBOX'],
        },
      });
    }
  } catch (error) {
    console.error('Error checking recharge emails:', error);
  }
}