'use client'
// app/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ShopPage() {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(`/api/menu`, {
        cache: 'no-cache',
      })
      if (!res.ok) throw new Error('Failed to fetch menu data')
      setMenu(await res.json())
    }
    fetchMenu()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            咖啡菜單
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            精選咖啡，為您帶來美好的一天
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((item: any) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-500 mb-4 h-12">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${item.price}
                  </span>
                  <Link
                    href={`/shop/order/${item.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    點餐
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
