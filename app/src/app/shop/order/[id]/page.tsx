'use client'
// app/order/[id]/page.tsx
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Loading from '@/app/loading'

async function getMenuItem(id: string) {
  const res = await fetch(`/api/menu?id=${id}`, {
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
  const router = useRouter()
  const { dispatch } = useCart()
  const [ice, setIce] = useState('正常冰')
  const [count, setCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [item, setItem] = useState<any>(null)
  const [milkRatio, setMilkRatio] = useState('標準')

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setItem(await getMenuItem(resolvedParams.id))
    };
    resolveParams();
  }, [params]);

  async function handleAddToCart() {
    if (!item) return
    console.log('handleAddToCart called at:', new Date().toISOString())
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        menuId: item.id,
        menuItem: item,
        quantity: count,
        ice,
        ...(item.hasMilk ? { milkRatio } : {}),
      },
    })
    
    router.push('/shop/cart')
  }

  if (!item) {
    return <Loading />
  }

  return (
    <div className="max-w-md mx-auto border p-4 rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">點餐 - {item.name}</h2>
      <p className="mb-2">價格：${item.price}</p>

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
      {/* 只有含牛奶的飲品才顯示牛奶比例選擇 */}
      {item.hasMilk && (
        <div className="mb-2">
          <label className="block font-semibold">牛奶比例</label>
          <select
            className="border p-1 rounded"
            value={milkRatio}
            onChange={(e) => setMilkRatio(e.target.value)}
          >
            <option>標準</option>
            <option>少奶</option>
            <option>多奶</option>
          </select>
        </div>
      )}

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
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
      >
        加入購物車
      </button>
    </div>
  )
}
