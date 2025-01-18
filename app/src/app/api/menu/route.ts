// app/api/menu/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
    const { name, description, price, hasMilk } = await request.json()
    const newItem = await prisma.menuItem.create({
      data: {
        id: Date.now().toString(),
        name,
        description,
        price: Number(price),
        hasMilk: Boolean(hasMilk),
        isDeleted: false
      }
    })
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    // 檢查是否有相關的訂單項目
    const orderItems = await prisma.orderItem.findFirst({
      where: {
        menuItemId: id
      }
    })

    if (orderItems) {
      // 如果有相關訂單，標記為已刪除
      const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: { isDeleted: true }
      })
      return NextResponse.json(updatedItem, { status: 200 })
    } else {
      // 如果沒有相關訂單，直接刪除
      await prisma.menuItem.delete({ where: { id } })
      return NextResponse.json({ message: 'Item deleted' }, { status: 200 })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' }, 
      { status: 500 }
    )
  }
}
