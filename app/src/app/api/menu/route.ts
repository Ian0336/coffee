// app/api/menu/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    await prisma.$connect();
    console.log("✅ Prisma successfully connected to the database!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const item = await prisma.menuItem.findUnique({
        where: { id }
      })
      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }
      return NextResponse.json(item)
    } else {
      const items = await prisma.menuItem.findMany()
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
        hasMilk: Boolean(hasMilk)
      }
    })
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
