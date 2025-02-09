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
    
    const sent = await sendRechargeEmail(email);
    
    if (sent) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Failed to send recharge email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 