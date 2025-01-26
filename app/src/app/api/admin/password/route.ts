import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    const { currentPassword, newPassword, sessionKey } = await request.json()

    // 驗證管理員 session
    if (!await verifyAdminSession(sessionKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 獲取當前管理員 session
    const adminSession = await prisma.adminSession.findFirst()
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Admin session not found' },
        { status: 500 }
      )
    }

    // 驗證當前密碼
    if (currentPassword !== adminSession.password) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // 更新密碼
    await prisma.adminSession.update({
      where: { id: adminSession.id },
      data: { password: newPassword }
    })

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Update password error:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
} 