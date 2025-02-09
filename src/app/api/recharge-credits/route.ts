import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth.options';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { updateUserCredits } from '@/lib/actions/user-actions';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Pass true for isRecharge parameter
    const result = await updateUserCredits(user.id, user.credits + 5, true);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      credits: user.credits + 5,
    });
  } catch (err) {
    console.error('Failed to recharge credits:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 