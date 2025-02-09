import { sendRechargeEmail } from '@/lib/email-service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth.options';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Sending recharge email to:', email); // Debug log
    
    const sent = await sendRechargeEmail(email);
    
    if (sent) {
      console.log('Email sent successfully'); // Debug log
      return NextResponse.json({ 
        success: true,
        message: 'Recharge email sent successfully' 
      });
    } else {
      console.error('Failed to send email'); // Debug log
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Failed to send recharge email:', err);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
} 