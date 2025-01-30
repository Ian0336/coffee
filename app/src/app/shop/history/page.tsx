'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/contexts/LiffContext'
import Loading from '@/app/loading'

type OrderItem = {
  menuItem: {
    name: string
    price: number
  }
  quantity: number
  ice: string
  milkRatio?: string
  price: number
}

type Order = {
  userName: string
  userId: string
  id: string
  status: string
  createdAt: string
  completedAt: string | null
  items: OrderItem[]
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { userId } = useLiff()
  const router = useRouter()

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders/user/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error('Fetch orders error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  if (loading) {
    return <Loading />
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>尚無訂單紀錄</p>
        <button
          onClick={() => router.push('/shop')}
          className="text-blue-600 hover:underline mt-2"
        >
          返回點餐
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">我的訂單紀錄</h1>
      
      <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">訂單編號：{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    訂購時間：{new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    訂購狀態：{order.status == 'pending' ? '未完成' : '已完成'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">
                    ${order.items.reduce((sum, item) => 
                      sum + (item.price * item.quantity), 0
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <table className="w-full">
                  <thead className="text-sm text-gray-600">
                    <tr>
                      <th className="text-left">品項</th>
                      <th className="text-center">數量</th>
                      <th className="text-right">金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="text-sm">
                        <td className="py-1">{item.menuItem.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">${item.price * item.quantity}</td>
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