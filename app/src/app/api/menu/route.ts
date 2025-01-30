// app/api/menu/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const item = await prisma.menuItem.findFirst({
        where: { 
          id,
          isDeleted: false
        }
      })
      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }
      return NextResponse.json(item)
    } else {
      const items = await prisma.menuItem.findMany({
        where: {
          isDeleted: false
        }
      })
      return NextResponse.json(items)
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, hasMilk, series, sessionKey } = await request.json()
    
    // 驗證管理員權限
    if (!await verifyAdminSession(sessionKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const newItem = await prisma.menuItem.create({
      data: {
        id: Date.now().toString(),
        name,
        description,
        price: Number(price),
        hasMilk: Boolean(hasMilk),
        series,
        isDeleted: false
      }
    })
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, sessionKey } = await request.json()
    
    // 驗證管理員權限
    if (!await verifyAdminSession(sessionKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orderItems = await prisma.orderItem.findFirst({
      where: {
        menuItemId: id
      }
    })

    if (orderItems) {
      const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: { isDeleted: true }
      })
      return NextResponse.json(updatedItem, { status: 200 })
    } else {
      await prisma.menuItem.delete({ where: { id } })
      return NextResponse.json(
        { message: 'Item deleted' },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, price, hasMilk, series, sessionKey } = await request.json()

    // 驗證管理員 session
    if (!await verifyAdminSession(sessionKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price,
        hasMilk,
        series
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Update menu item error:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}
