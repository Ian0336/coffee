'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

// app/admin/menu/page.tsx
// async function getAllMenuItems() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu`, {
//     cache: 'no-cache',
//   })
//   if (!res.ok) {
//     throw new Error('Failed to fetch menu')
//   }
//   return res.json()
// }

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  hasMilk: boolean
  series: string
}

export default function AdminMenu() {
  const router = useRouter()
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [toggle, setToggle] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(`/api/menu`, {
        cache: 'no-cache',
      })
      if (!res.ok) throw new Error('Failed to fetch menu data')
      let data = await res.json()
      setMenu(data)
      console.log(data)
    }
    fetchMenu()
  }, [toggle])

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除此品項嗎？')) {
      try {
        const sessionKey = localStorage.getItem('adminSeed')
        if (!sessionKey) {
          alert('請先登入')
          router.push('/admin')
          return
        }

        const res = await fetch(`/api/menu`, {
          method: 'DELETE',
          body: JSON.stringify({ 
            id,
            sessionKey 
          })
        })
        if (!res.ok) {
          if (res.status === 401) {
            alert('未授權，請重新登入')
            router.push('/admin')
            return
          }
          throw new Error('刪除失敗')
        }
        alert('已刪除品項')
        setToggle(!toggle)
      } catch (err) {
        alert('刪除失敗')
      }
    }
  }

  const handleEdit = async (item: MenuItem) => {
    try {
      const sessionKey = localStorage.getItem('adminSeed')
      if (!sessionKey) {
        alert('請先登入')
        router.push('/admin')
        return
      }

      const res = await fetch(`/api/menu`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...item,
          sessionKey 
        })
      })

      if (!res.ok) {
        if (res.status === 401) {
          alert('未授權，請重新登入')
          router.push('/admin')
          return
        }
        throw new Error('更新失敗')
      }
      
      alert('已更新品項')
      setEditingItem(null)
      setToggle(!toggle)
    } catch (err) {
      alert('更新失敗')
    }
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">編輯菜單</h1>
      <NewMenuItemForm toggle={toggle} setToggle={setToggle} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">現有品項</h2>
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {menu.map((item: MenuItem) => (
              <li key={item.id} className="p-4 hover:bg-gray-50">
                {editingItem?.id === item.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">品名</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">系列</label>
                        <input
                          type="text"
                          value={editingItem.series}
                          onChange={(e) => setEditingItem({...editingItem, series: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                      <input
                        type="text"
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">價格</label>
                        <input
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                          className="w-32 px-3 py-2 border rounded-md"
                          min={0}
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingItem.hasMilk}
                          onChange={(e) => setEditingItem({...editingItem, hasMilk: e.target.checked})}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">含牛奶</span>
                      </label>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleEdit(editingItem)}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        儲存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-500">系列：{item.series}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-4">
                        <span className="text-sm text-gray-500">{item.description}</span>
                        <span className="font-medium text-blue-600">${item.price}</span>
                        {item.hasMilk && (
                          <span className="text-sm text-gray-500">含牛奶</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md hover:bg-blue-50"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-md hover:bg-red-50"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


// import { useState } from 'react'

function NewMenuItemForm({ toggle, setToggle }: any) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [hasMilk, setHasMilk] = useState(false)
  const [series, setSeries] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [existingSeries, setExistingSeries] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 獲取現有的所有系列
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch('/api/menu')
        if (!res.ok) throw new Error('Failed to fetch menu')
        const items = await res.json()
        const uniqueSeries = Array.from(new Set(items.map((item: any) => item.series)))
        setExistingSeries(uniqueSeries as string[])
        setSuggestions(uniqueSeries as string[])
      } catch (err) {
        console.error('Failed to fetch series:', err)
      }
    }
    fetchSeries()
  }, [toggle])

  // 處理輸入變化
  useEffect(() => {
    console.log('value', series.trim())
    if (series.trim()) {
      // 檢查輸入值是否與現有系列的開頭相符
      const filtered = existingSeries.filter(s => 
        s.toLowerCase().startsWith(series.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      // 當輸入為空時顯示所有系列
      setSuggestions(existingSeries)
    }
  }, [series, existingSeries])

  // 點擊建議項目
  const handleSuggestionClick = (value: string) => {
    console.log('value', value)
    setSeries(value)
    setShowSuggestions(false)
  }

  // 點擊外部時關閉建議列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!series.trim()) {
      alert('請輸入系列名稱')
      return
    }
    setLoading(true)
    try {
      const sessionKey = localStorage.getItem('adminSeed')
      if (!sessionKey) {
        alert('請先登入')
        return
      }

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          hasMilk,
          series: series.trim(),
          sessionKey
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to add menu item')
      }

      setName('')
      setDescription('')
      setPrice(0)
      setHasMilk(false)
      setSeries('')
      setToggle(!toggle)
      alert('新增成功！')
    } catch (err) {
      alert('新增失敗')
    } finally {
      setLoading(false)
    }
  }
  // console.log('suggestions', suggestions)
  // console.log('showSuggestions', showSuggestions)
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">新增品項</h3>
      
      {/* 系列輸入區域 */}
      <div className="mb-6 relative" ref={inputRef}>
        <label className="block font-medium mb-2 text-gray-700">系列</label>
        <input
          type="text"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="輸入或選擇系列名稱"
          onClick={() => setShowSuggestions(true)}
        />
        
        {/* 建議列表 */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">品名</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">描述</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={hasMilk}
              onChange={(e) => setHasMilk(e.target.checked)}
            />
            <span className="font-medium">是否含牛奶</span>
          </label>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">價格</label>
          <input
            type="number"
            className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-colors"
        >
          {loading ? '新增中...' : '新增品項'}
        </button>
      </div>
    </form>
  )
}
