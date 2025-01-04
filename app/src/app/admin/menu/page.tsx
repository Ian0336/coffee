// app/admin/menu/page.tsx

async function getAllMenuItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu`, {
    cache: 'no-cache',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch menu')
  }
  return res.json()
}

export default async function AdminMenu() {
  const menu = await getAllMenuItems()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">編輯菜單</h1>
      <NewMenuItemForm />
      <div className="mt-4">
        <h2 className="font-semibold mb-2">現有品項</h2>
        <ul className="list-disc list-inside">
          {menu.map((item: any) => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'

function NewMenuItemForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price }),
      })
      if (!res.ok) {
        throw new Error('Failed to create new menu item')
      }
      alert('已新增品項！')
      // 這裡可以用 router.refresh() 重新載入資料
    } catch (err) {
      alert('新增失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 mb-4">
      <h3 className="font-semibold mb-2">新增品項</h3>
      <div className="mb-2">
        <label className="block">品名</label>
        <input
          type="text"
          className="border p-1 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">描述</label>
        <input
          type="text"
          className="border p-1 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block">價格</label>
        <input
          type="number"
          className="border p-1 rounded"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        {loading ? '新增中...' : '新增品項'}
      </button>
    </form>
  )
}
