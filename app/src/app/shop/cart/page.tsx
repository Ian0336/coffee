'use client'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLiff } from '@/contexts/LiffContext'
import liff from '@line/liff'
import { CartItem } from '@/contexts/CartContext'

type EditingItem = {
  menuId: string
  menuItem: {
    id: string
    name: string
    price: number
    hasMilk?: boolean
  }
  quantity: number
  ice: string
  milkRatio?: string
}

export default function CartPage() {
  const { state, dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { userId, displayName } = useLiff()
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const total = state.items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  )

  const handleEdit = (item: CartItem) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: item
    })
    
    if (editingItem) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          menuId: editingItem.menuId,
          menuItem: editingItem.menuItem,
          quantity: editingItem.quantity,
          ice: editingItem.ice,
          ...(editingItem.menuItem.hasMilk ? { milkRatio: editingItem.milkRatio } : {}),
        }
      })
    }
    setEditingItem(null)
  }

  async function handleSubmitOrder() {
    try {
      setIsLoading(true)
      if (!userId || !displayName) {
        alert('請先登入 LINE')
        return
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          userId,
          userName: displayName,
          accessToken: await liff.getAccessToken()
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create order')
      }

      dispatch({ type: 'CLEAR_CART' })
      router.push('/shop/history')
      alert('訂單已送出！')
    } catch (err) {
      alert('送出訂單失敗')
    } finally {
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p>購物車是空的</p>
        <Link href="/shop" className="text-blue-600 hover:underline">
          返回點餐
        </Link>
      </div>
    )
  }
  console.log('user', userId)
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">購物車</h1>
      </div>

      <div className="border rounded-lg overflow-hidden mb-4">
        {state.items.map((item, index) => (
          <div
            key={`${item.menuId}-${index}`}
            className="p-4 border-b last:border-b-0"
          >
            {editingItem?.menuId === item.menuId ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{item.menuItem.name}</h3>
                  <span className="text-sm text-gray-500">
                    ${item.menuItem.price} / 杯
                  </span>
                </div>
                
                <div className="space-y-3">
                  {/* 冰熱選擇 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">溫度</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="冰"
                          checked={editingItem.ice === '冰'}
                          onChange={(e) => setEditingItem({...editingItem, ice: e.target.value})}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">冰</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="熱"
                          checked={editingItem.ice === '熱'}
                          onChange={(e) => setEditingItem({...editingItem, ice: e.target.value})}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">熱</span>
                      </label>
                    </div>
                  </div>

                  {/* 牛奶比例選擇 */}
                  {item.menuItem.hasMilk && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">牛奶比例</label>
                      <select
                        value={editingItem.milkRatio}
                        onChange={(e) => setEditingItem({...editingItem, milkRatio: e.target.value})}
                        className="form-select block w-full border-gray-300 rounded-md shadow-sm"
                      >
                        <option>標準</option>
                        <option>少奶</option>
                        <option>多奶</option>
                      </select>
                    </div>
                  )}

                  {/* 數量選擇 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">數量</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => editingItem.quantity > 1 && 
                          setEditingItem({...editingItem, quantity: editingItem.quantity - 1})}
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={editingItem.quantity}
                        onChange={(e) => setEditingItem({
                          ...editingItem, 
                          quantity: Math.max(1, parseInt(e.target.value) || 1)
                        })}
                        className="w-16 text-center border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingItem({
                          ...editingItem, 
                          quantity: editingItem.quantity + 1
                        })}
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-3 py-1.5 text-sm text-gray-600 border rounded hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    確認
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => dispatch({
                      type: 'REMOVE_ITEM',
                      payload: item
                    })}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                  >
                    移除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">總計: ${total}</div>
          <div className="flex gap-4">
            <Link
              href="/shop"
              className="px-6 py-2 text-blue-600 hover:text-blue-800"
            >
              繼續購物
            </Link>
            <button
              onClick={handleSubmitOrder}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? '處理中...' : '送出'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 