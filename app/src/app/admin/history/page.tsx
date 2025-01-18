// app/admin/history/page.tsx

async function getCompletedOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?status=completed`, {
    cache: 'no-cache',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch completed orders')
  }
  return res.json()
}

export default async function AdminHistory() {
  const orders = await getCompletedOrders()
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => {
      return itemSum + (item.menuItem.price * item.quantity)
    }, 0)
  }, 0)
  console.log('orders', orders) 
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">歷史訂單 & 收益</h1>
        <p className="text-lg md:text-xl font-semibold text-green-600">
          總收益：${totalRevenue}
        </p>
      </div>

      {/* 手機版 - 卡片式設計 */}
      <div className="block sm:hidden space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">訂單編號</div>
            <div className="font-medium mb-1">{order.id}</div>
            <div className="text-sm text-gray-500">訂單時間</div>
            <div className="font-medium mb-1">
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">完成時間</div>
            <div className="font-medium mb-3">
              {order.completedAt ? new Date(order.completedAt).toLocaleString() : '未記錄'}
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index}>
                  <div className="text-sm text-gray-500">品項</div>
                  <div>{item.menuItem.name}</div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <div className="text-sm text-gray-500">單價</div>
                      <div>${item.menuItem.price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">數量</div>
                      <div>{item.quantity}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">小計</div>
                    <div>${item.menuItem.price * item.quantity}</div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">總金額</div>
                <div className="text-lg font-medium">
                  ${order.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 桌面版 - 表格式設計 */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 md:p-3">訂單編號</th>
              <th className="border p-2 md:p-3">訂單時間</th>
              <th className="border p-2 md:p-3">完成時間</th>
              <th className="border p-2 md:p-3">品項</th>
              <th className="border p-2 md:p-3">單價</th>
              <th className="border p-2 md:p-3">數量</th>
              <th className="border p-2 md:p-3">金額</th>
            </tr>
          </thead>
          <tbody>
            {orders.flatMap((order) =>
              order.items.map((item, index) => (
                <tr key={`${order.id}-${index}`}>
                  <td className="border p-2 md:p-3">
                    <div>{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    {order.userName && (
                      <div className="text-sm text-gray-600">
                        訂購人: {order.userName}
                      </div>
                    )}
                  </td>
                  <td className="border p-2 md:p-3">
                    {index === 0 ? new Date(order.createdAt).toLocaleString() : ''}
                  </td>
                  <td className="border p-2 md:p-3">
                    {index === 0 ? (order.completedAt ? new Date(order.completedAt).toLocaleString() : '未記錄') : ''}
                  </td>
                  <td className="border p-2 md:p-3">{item.menuItem.name}</td>
                  <td className="border p-2 md:p-3">${item.menuItem.price}</td>
                  <td className="border p-2 md:p-3">{item.quantity}</td>
                  <td className="border p-2 md:p-3 font-medium">
                    ${item.menuItem.price * item.quantity}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
