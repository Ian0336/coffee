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
}

type Order = {
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
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">訂單編號</p>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-gray-500 mt-2">訂單狀態</p>
                <p className="font-medium">
                  {order.status === 'pending' ? '製作中' : '已完成'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">訂單時間</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                {order.completedAt && (
                  <>
                    <p className="text-sm text-gray-500 mt-2">完成時間</p>
                    <p className="font-medium">
                      {new Date(order.completedAt).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium mb-2">訂購項目</p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-600">
                        冰塊: {item.ice}
                        {item.milkRatio && `, 牛奶: ${item.milkRatio}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        ${item.menuItem.price} x {item.quantity}
                      </p>
                      <p className="font-medium">
                        ${item.menuItem.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">總計</p>
                  <p className="font-medium">
                    $
                    {order.items.reduce(
                      (sum, item) =>
                        sum + item.menuItem.price * item.quantity,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 