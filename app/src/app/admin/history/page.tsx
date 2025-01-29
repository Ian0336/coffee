'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// app/admin/history/page.tsx

type OrderItem = {
  id: string
  price: number
  quantity: number
  menuItem: {
    name: string
  }
}

type Order = {
  id: string
  userName: string
  createdAt: string
  items: OrderItem[]
  status: string
}

async function getCompletedOrders() {
  const res = await fetch(`/api/orders?status=completed`, {
    cache: 'no-cache',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }
  return res.json()
}

export default function AdminHistory() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchOrders()
  }, [startDate, endDate])

  async function fetchOrders() {
    try {
      const res = await fetch(`/api/orders?status=completed`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      let data = await res.json()

      // 過濾日期範圍內的訂單
      const filteredOrders = data.filter((order: Order) => {
        const orderDate = new Date(order.createdAt)
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return orderDate >= start && orderDate <= end
      })

      setOrders(filteredOrders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 計算總營收
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => 
      itemSum + (item.price * item.quantity), 0
    )
  }, 0)

  if (loading) {
    return <div className="p-4">載入中...</div>
  }
  console.log(startDate, endDate)
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">歷史訂單 & 營收統計</h1>
        
        {/* 日期選擇區域 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                結束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* 統計資訊 */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">訂單數量</div>
                <div className="text-2xl font-bold text-blue-600">
                  {orders.length}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">總營收</div>
                <div className="text-2xl font-bold text-green-600">
                  ${totalRevenue}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 訂單列表 */}
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
                    訂購人：{order.userName}
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

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              此期間沒有訂單記錄
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
