'use client'
// app/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '../loading'

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  hasMilk: boolean
  series: string
}

export default function ShopPage() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(`/api/menu`, {
        cache: 'no-cache',
      })
      if (!res.ok) throw new Error('Failed to fetch menu data')
      setMenu(await res.json())
      setIsLoading(false)
    }
    fetchMenu()
  }, [])

  // 將菜單按系列分組
  const menuBySeries = menu.reduce((acc, item) => {
    if (!acc[item.series]) {
      acc[item.series] = []
    }
    acc[item.series].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
           㨗克手沖咖啡
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            精選咖啡豆，專業烘焙
          </p>
        </div>

        {/* 依系列顯示商品 */}
        {Object.entries(menuBySeries).map(([series, items]) => (
          <div key={series} className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{series}</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
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
        ))}
      </div>
    </div>
  )
}
