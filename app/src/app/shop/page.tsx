'use client'
// app/page.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'

// 取得菜單資料
// async function getMenu() {
// const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu`, {
//   cache: 'no-cache',
// })
// if (!res.ok) throw new Error('Failed to fetch menu data')
// return res.json()

//   // 模擬資料
//   // return [
//   //   { id: '1', name: '美式咖啡', description: '香濃黑咖啡', price: 60 },
//   //   { id: '2', name: '拿鐵', description: '牛奶與咖啡結合', price: 80 },
//   // ]
// }

export default function Home() {
  const [menu, setMenu] = useState([])
  // const menu = await getMenu()

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu`, {
        cache: 'no-cache',
      })
      if (!res.ok) throw new Error('Failed to fetch menu data')
      setMenu(await res.json())
    }
    fetchMenu()
  }, [])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">咖啡菜單</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map((item: any) => (
          <div
            key={item.id}
            className="border rounded p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">${item.price}</span>
              <Link
                href={`/shop/order/${item.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                點餐
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
