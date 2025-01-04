// app/admin/orders/page.tsx

async function getPendingOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?status=pending`, {
    cache: 'no-cache',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch pending orders')
  }
  return res.json()
}

export default async function AdminOrders() {
  const orders = await getPendingOrders()

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">未完成訂單</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">訂單編號</th>
            <th className="border p-2">品項</th>
            <th className="border p-2">客製化</th>
            <th className="border p-2">數量</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.menuItem.name}</td>
              <td className="border p-2">
                甜度: {order.sugar}, 冰塊: {order.ice}
              </td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">
                <CompleteButton orderId={order.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 用一個 Client Component 實作「完成」按鈕
'use client'
import { useState } from 'react'

function CompleteButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      if (!res.ok) {
        throw new Error('Failed to complete order')
      }
      alert('訂單已完成！')
      // 這裡可以用 router.refresh() 或其他方式重新拉取資料
    } catch (err) {
      alert('更新失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
    >
      {loading ? '處理中...' : '完成'}
    </button>
  )
}
