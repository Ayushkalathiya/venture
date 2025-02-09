import { NextResponse } from 'next/server';
import { checkRechargeEmails } from '@/lib/gmail-service';

export async function GET() {
  try {
    await checkRechargeEmails();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to check recharge emails:', err);
    return NextResponse.json(
      { error: 'Failed to check recharge emails' },
      { status: 500 }
    );
  }
} 