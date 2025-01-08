// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { mockOrders } from '../_mock/orders'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  
  let result = mockOrders
  if (status) {
    result = mockOrders.filter((o) => o.status === status)
  }

  return NextResponse.json(result, { status: 200 })
}

export async function POST(request: Request) {
  const { items } = await request.json()
  
  const newOrder = {
    id: crypto.randomUUID(),
    items: items.map((item: any) => ({
      menuId: item.menuId,
      menuItem: {
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
      },
      ice: item.ice,
      ...(item.milkRatio ? { milkRatio: item.milkRatio } : {}),
      quantity: item.quantity,
    })),
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  }
  
  mockOrders.push(newOrder)
  console.log('updated mockOrders', mockOrders)
  return NextResponse.json(newOrder, { status: 201 })
}
