'use server'

import db from "@/lib/db"

export async function updateUserCredits(userId: string, newCredits: number, isRecharge: boolean = false) {
  try {
    if (isRecharge) {
      // Check for recharge eligibility only during recharge operation
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { hasRecharged: true }
      });

      if (user?.hasRecharged) {
        return { 
          success: false, 
          error: 'You have already used your one-time recharge. Please contact support for more credits.' 
        };
      }

      // Recharge credits and mark as recharged
      await db.user.update({
        where: { id: userId },
        data: { 
          credits: newCredits,
          hasRecharged: true
        },
      });
    } else {
      // Simple credit update for search operations
      await db.user.update({
        where: { id: userId },
        data: { credits: newCredits },
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user credits:', error);
    return { success: false, error: 'Failed to update credits' };
  }
}
