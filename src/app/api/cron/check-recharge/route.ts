import { NextResponse } from 'next/server';
import { checkRechargeEmails } from '@/lib/gmail-service';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await checkRechargeEmails();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to check emails:', err);
    return NextResponse.json({ error: 'Failed to check emails' }, { status: 500 });
  }
} 