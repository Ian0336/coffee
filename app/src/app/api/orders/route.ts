// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

export async function POST(request: Request) {
  try {
    const { items, userId, userName } = await request.json()
    
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
