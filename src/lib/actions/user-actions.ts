'use server'

import db  from "@/lib/db"

export async function updateUserCredits(userId: string, newCredits: number) {
  try {
    await db.user.update({
      where: {
        id: userId
      },
      data: {
        credits: newCredits
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user credits:', error)
    return { success: false, error: 'Failed to update credits' }
  }
}
