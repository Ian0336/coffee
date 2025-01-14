'use client'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CartPage() {
  const { state, dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const total = state.items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  )

  async function handleCheckout() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
        }),
      })

      if (!res.ok) {
        throw new Error('下單失敗')
      }

      alert('訂單已送出！')
      dispatch({ type: 'CLEAR_CART' })
      router.push('/')
    } catch (err) {
      alert('下單失敗')
    } finally {
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p>購物車是空的</p>
        <a href="/" className="text-blue-600 hover:underline">
          返回點餐
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">購物車</h1>
      </div>

      <div className="border rounded-lg overflow-hidden mb-4">
        {state.items.map((item, index) => (
          <div
            key={`${item.menuId}-${index}`}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div>
              <h3 className="font-semibold">{item.menuItem.name}</h3>
              <p className="text-sm text-gray-600">
                冰塊: {item.ice}
                {item.milkRatio && `, 牛奶: ${item.milkRatio}`}
              </p>
              <p className="text-sm">
                ${item.menuItem.price} x {item.quantity} = ${item.menuItem.price * item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: {
                  menuId: item.menuId,
                  menuItem: item.menuItem,
                  quantity: item.quantity,
                  ice: item.ice,
                  ...(item.menuItem.hasMilk ? { milkRatio: item.milkRatio } : {}),
                }
                })}
                className="text-red-600 hover:text-red-800"
              >
                移除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">總計: ${total}</div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-2 text-blue-600 hover:text-blue-800"
            >
              繼續購物
            </Link>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? '處理中...' : '結帳'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 