'use client'
// app/order/[id]/page.tsx
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

async function getMenuItem(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu?id=${id}`, {
    cache: 'no-cache',
  })
  if (!res.ok) {
    return null
  }
  return res.json()
}

// 注意：這個頁面是 "Server Component" 
// 如果你需要在前端即時操作狀態，可以搭配 useState / client component
// export default async function OrderPage({
//   params: { id },
// }: {
//   params: { id: string }
// }) {
//   const item = await getMenuItem(id)
//   if (!item) {
//     notFound()
//   }

//   return (
//     <OrderClient item={item} />
//   )
// }

// 分離一個 Client Component 來管理前端狀態 (甜度、冰塊、數量等等)
export default function OrderClient({ params }: any) {
  const [sugar, setSugar] = useState('正常糖')
  const [ice, setIce] = useState('正常冰')
  const [count, setCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setItem(await getMenuItem(resolvedParams.id))
    };
    resolveParams();
  }, [params]);

  async function handleOrder() {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuId: item.id,
          sugar,
          ice,
          quantity: count,
        }),
      })
      if (!res.ok) {
        throw new Error(`Failed to create order`)
      }
      // 例如：送完訂單後導向某個成功頁面
      alert('訂單已送出！')
    } catch (err) {
      console.error(err)
      alert('下單失敗！')
    } finally {
      setIsLoading(false)
    }
  }
  if (!item) {
    return <div>loading...</div>
  }
  return (
    <div className="max-w-md mx-auto border p-4 rounded">
      <h2 className="text-2xl font-bold mb-4">點餐 - {item.name}</h2>
      <p className="mb-2">價格：${item.price}</p>

      {/* 甜度選擇 */}
      <div className="mb-2">
        <label className="block font-semibold">甜度</label>
        <select
          className="border p-1 rounded"
          value={sugar}
          onChange={(e) => setSugar(e.target.value)}
        >
          <option>正常糖</option>
          <option>半糖</option>
          <option>無糖</option>
        </select>
      </div>

      {/* 冰塊選擇 */}
      <div className="mb-2">
        <label className="block font-semibold">冰塊</label>
        <select
          className="border p-1 rounded"
          value={ice}
          onChange={(e) => setIce(e.target.value)}
        >
          <option>正常冰</option>
          <option>少冰</option>
          <option>去冰</option>
          <option>熱飲</option>
        </select>
      </div>

      {/* 數量 */}
      <div className="mb-2">
        <label className="block font-semibold">數量</label>
        <input
          type="number"
          className="border p-1 rounded w-20"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleOrder}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
      >
        {isLoading ? '送出中...' : '送出訂單'}
      </button>
    </div>
  )
}
