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
  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + order.menuItem.price * order.quantity,
    0
  )

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">歷史訂單 & 收益</h1>
      <p className="mb-2">總收益：${totalRevenue}</p>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">訂單編號</th>
            <th className="border p-2">品項</th>
            <th className="border p-2">單價</th>
            <th className="border p-2">數量</th>
            <th className="border p-2">金額</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.menuItem.name}</td>
              <td className="border p-2">${order.menuItem.price}</td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">
                ${order.menuItem.price * order.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
