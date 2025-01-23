// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  
  try {
    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })
    
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

async function verifyLineUser(accessToken: string, userId: string) {
  try {
    if (!accessToken || !userId) {
      console.error('Missing accessToken or userId');
      return false;
    }
    // 使用 LINE API 驗證用戶
    const res = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!res.ok) {
      return false
    }

    const profile = await res.json()
    return profile.userId === userId
  } catch (error) {
    console.error('LINE verification error:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { items, userId, userName, accessToken } = await request.json()
    
    // 驗證 LINE 用戶
    if (!await verifyLineUser(accessToken, userId)) {
      return NextResponse.json(
        { error: 'Unauthorized LINE user' },
        { status: 401 }
      )
    }

    const order = await prisma.order.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        userName,
        status: 'pending',
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuId,
            ice: item.ice,
            milkRatio: item.milkRatio,
            quantity: item.quantity,
            price: item.menuItem.price
          }))
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
