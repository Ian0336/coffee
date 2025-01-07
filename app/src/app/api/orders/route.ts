// app/api/orders/route.ts
import { NextResponse } from 'next/server'

// 模擬資料
let mockOrders = [
  // 範例： { id: 'abc', menuId: '1', sugar: '半糖', ice: '少冰', quantity: 2, status: 'pending', ... }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  let result = mockOrders

  if (status) {
    result = mockOrders.filter((o) => o.status === status)
  }

  // 這裡也要想辦法把 menuItem 連同回傳，假設你有資料庫可 join
  // 這裡就 mock 一下
  const withMenuInfo = result.map((order) => {
    return {
      ...order,
      menuItem: {
        id: order.menuId,
        name:
          order.menuId === '1'
            ? '美式咖啡'
            : order.menuId === '2'
            ? '拿鐵'
            : '未知咖啡',
        price: order.menuId === '1' ? 60 : 80,
      },
    }
  })

  return NextResponse.json(withMenuInfo, { status: 200 })
}

export async function POST(request: Request) {
  const { items } = await request.json()
  
  // 創建一個包含多個品項的訂單
  const newOrder = {
    id: crypto.randomUUID(),
    items: items.map((item: any) => ({
      menuId: item.menuId,
      sugar: item.sugar,
      ice: item.ice,
      quantity: item.quantity,
    })),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  
  mockOrders.push(newOrder)
  return NextResponse.json(newOrder, { status: 201 })
}
