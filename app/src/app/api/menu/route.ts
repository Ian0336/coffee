// app/api/menu/route.ts
import { NextResponse } from 'next/server'

// 模擬資料
let mockMenu = [
  { id: '1', name: '美式咖啡', description: '香濃黑咖啡', price: 60, hasMilk: false },
  { id: '2', name: '拿鐵', description: '牛奶與咖啡結合', price: 80, hasMilk: true },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) {
    // 查詢單一 item
    const item = mockMenu.find((m) => m.id === id)
    return NextResponse.json(item ?? null, { status: item ? 200 : 404 })
  } else {
    // 查詢全部
    return NextResponse.json(mockMenu, { status: 200 })
  }
}

export async function POST(request: Request) {
  const { name, description, price } = await request.json()
  // 這裡應該做更多驗證
  const newItem = {
    id: Date.now().toString(),
    name,
    description,
    price: Number(price),
  }
  mockMenu.push(newItem)
  return NextResponse.json(newItem, { status: 201 })
}
