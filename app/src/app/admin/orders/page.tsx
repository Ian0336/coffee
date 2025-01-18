'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
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
        className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700 transition-colors"
      >
        {isLoading ? '處理中...' : '完成訂單'}
      </button>
    )
  }
  function CancelButton({ orderId }: { orderId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    async function handleCancel() {
      setIsLoading(true)
      if (!window.confirm('確定要取消此訂單嗎？')) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          throw new Error('取消訂單失敗')
        }
        alert('訂單已取消！')
        fetchOrders()
      } catch (err) {
        alert('取消失敗')
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <button
        onClick={handleCancel}
        disabled={isLoading}
        className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-red-700 transition-colors"
      >
        {isLoading ? '處理中...' : 'X'}
      </button>
    )
  }


  if (loading) {
    return <div className="p-4">載入中...</div>
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4">未完成訂單</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-3 md:p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div className="space-y-1">
                <h2 className="text-base md:text-lg font-semibold">訂單編號: {order.id}</h2>
                <p className="text-sm text-gray-500">
                  訂單時間: {new Date(order.createdAt).toLocaleString()}
                </p>
                {order.userName && (
                  <p className="text-sm text-gray-600">
                    訂購人: {order.userName}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-[0.8]">
                  <CompleteButton orderId={order.id} />
                </div>
                <div className="flex-[0.2]">
                  <CancelButton orderId={order.id} />
                </div>
              </div>
            </div>

            <div className="block sm:hidden space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="border rounded p-3">
                  <div className="font-medium">{item.menuItem?.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>客製化：{item.ice}{item.milkRatio && `, 牛奶: ${item.milkRatio}`}</div>
                    <div>數量：{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2">品項</th>
                    <th className="text-left p-2">客製化</th>
                    <th className="text-left p-2 w-20">數量</th>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
