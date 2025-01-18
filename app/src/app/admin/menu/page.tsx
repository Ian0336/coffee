'use client'
import { useEffect, useState } from 'react'
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

export default function AdminMenu() {
  const router = useRouter()
  const [menu, setMenu] = useState([])
  const [toggle, setToggle] = useState(false)

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
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl font-bold mb-4">編輯菜單</h1>
      <NewMenuItemForm toggle={toggle} setToggle={setToggle} />
      <div className="mt-4">
        <h2 className="font-semibold mb-2">現有品項</h2>
        <ul className="list-disc list-inside">
          {menu.map((item: any) => (
            <li key={item.id} className="flex items-center justify-between">
              <span>{item.name} - ${item.price}</span>
              <button
                onClick={async () => {
                  if (confirm('確定要刪除此品項嗎？')) {
                    try {
                      console.log(item.id)
                      const res = await fetch(`/api/menu`, {
                        method: 'DELETE',
                        body: JSON.stringify({ id: item.id })
                      })
                      if (!res.ok) throw new Error('刪除失敗')
                      alert('已刪除品項')
                      setToggle(!toggle)
                    } catch (err) {
                      alert('刪除失敗')
                    }
                  }
                }}
                className="ml-4 px-2 py-1 text-sm text-red-600 hover:text-red-800"
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


// import { useState } from 'react'

function NewMenuItemForm({ toggle, setToggle }: { toggle: boolean, setToggle: (toggle: boolean) => void }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [hasMilk, setHasMilk] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, hasMilk }),
      })
      if (!res.ok) {
        throw new Error('Failed to create new menu item')
      }
      alert('已新增品項！')
      setToggle(!toggle)
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
        <label className="block">是否含牛奶</label>
        <input
          type="checkbox"
          className="border p-1 rounded"
          checked={hasMilk}
          onChange={(e) => setHasMilk(e.target.checked)}
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
