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
  const [temperature, setTemperature] = useState('冰')
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
        ice: temperature,
        ...(item.hasMilk ? { milkRatio } : {}),
      },
    })
    
    router.push('/shop/cart')
  }

  if (!item) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* 商品資訊區 */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.name}</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">系列：</span>
                {item.series}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">描述：</span>
                {item.description}
              </p>
              <p className="text-xl font-bold text-blue-600">
                ${item.price}
              </p>
            </div>
          </div>

          {/* 選項區域 */}
          <div className="space-y-6">
            {/* 冰熱選擇 */}
            <div>
              <label className="block font-medium text-gray-700 mb-3">溫度選擇</label>
              <div className="flex gap-6">
                <label className="relative flex items-center">
                  <input
                    type="radio"
                    name="temperature"
                    value="冰"
                    checked={temperature === '冰'}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
                  <span className="ml-2 text-gray-700 peer-checked:text-blue-600">冰</span>
                </label>
                <label className="relative flex items-center">
                  <input
                    type="radio"
                    name="temperature"
                    value="熱"
                    checked={temperature === '熱'}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
                  <span className="ml-2 text-gray-700 peer-checked:text-blue-600">熱</span>
                </label>
              </div>
            </div>

            {/* 牛奶比例選擇 */}
            {item.hasMilk && (
              <div>
                <label className="block font-medium text-gray-700 mb-3">牛奶比例</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  value={milkRatio}
                  onChange={(e) => setMilkRatio(e.target.value)}
                >
                  <option>標準</option>
                  <option>少奶</option>
                  <option>多奶</option>
                </select>
              </div>
            )}

            {/* 數量選擇 */}
            <div>
              <label className="block font-medium text-gray-700 mb-3">數量</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => count > 1 && setCount(count - 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-20 text-center px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min={1}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setCount(count + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 加入購物車按鈕 */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </span>
              ) : (
                '加入購物車'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
