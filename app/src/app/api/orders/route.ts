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
  const { menuId, sugar, ice, quantity } = await request.json()
  // 這裡應該做更多驗證
  const newOrder = {
    id: crypto.randomUUID(),
    menuId,
    sugar,
    ice,
    quantity,
    status: 'pending',
  }
  mockOrders.push(newOrder)
  return NextResponse.json(newOrder, { status: 201 })
}
