// app/api/orders/[orderId]/route.ts
import { NextResponse } from 'next/server'

// 為了示範，同樣使用同一個 mockOrders
// 實務上可把這些 mock 改為共用檔案或用資料庫替代
let mockOrders = [
  // ...
]

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params
  const { status } = await request.json()

  // 更新狀態
  const orderIndex = mockOrders.findIndex((o) => o.id === orderId)
  if (orderIndex === -1) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  }
  mockOrders[orderIndex].status = status

  return NextResponse.json(mockOrders[orderIndex], { status: 200 })
}
