'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const res = await fetch(`/api/orders?status=pending`, {
        cache: 'no-cache',
      })
      if (!res.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function CompleteButton({ orderId }: { orderId: string }) {
    const [isLoading, setIsLoading] = useState(false)
  
    async function handleComplete() {
      setIsLoading(true)
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
        fetchOrders()
      } catch (err) {
        alert('更新失敗')
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <button
        onClick={handleComplete}
        disabled={isLoading}
        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {isLoading ? '處理中...' : '完成'}
      </button>
    )
  }

  if (loading) {
    return <div>載入中...</div>
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">未完成訂單</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">訂單編號: {order.id}</h2>
              <CompleteButton orderId={order.id} />
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">品項</th>
                  <th className="text-left p-2">客製化</th>
                  <th className="text-left p-2">數量</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{item.menuItem?.name}</td>
                    <td className="p-2">
                      冰塊: {item.ice}
                      {item.milkRatio && `, 牛奶: ${item.milkRatio}`}
                    </td>
                    <td className="p-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-sm text-gray-500">
              訂單時間: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
