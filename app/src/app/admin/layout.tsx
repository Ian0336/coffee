'use client'
// app/admin/layout.tsx
import { useRouter, usePathname } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Loading from '../loading'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const storedSeed = localStorage.getItem('adminSeed')
      console.log('storedSeed', storedSeed)

      if (storedSeed) {
        // 驗證存儲的 seed 是否有效
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionKey: storedSeed })
        })
        if(res.ok) {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        } else {
          localStorage.removeItem('adminSeed')
          console.log('remove adminSeed')
          router.push('/admin')
          return
        }
      }
          
      // 如果沒有存儲的 seed，要求輸入密碼
      const password = window.prompt('請輸入管理員密碼:', '')
      console.log('password', password)
      if (!password) {
        router.push('/admin')
        return
      }

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (!res.ok) {
        alert('密碼錯誤！')
        router.push('/admin')
        return
      }

      const { seed } = await res.json()
      localStorage.setItem('adminSeed', seed)
      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname])

  // 登出功能
  const handleLogout = () => {
    localStorage.removeItem('adminSeed')
    router.push('/admin')
  }

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* 手機版頂部導航 */}
      <div className="sm:hidden bg-white border-b">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">後台管理</h2>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800"
          >
            登出
          </button>
        </div>
        <nav className="flex overflow-x-auto p-2 bg-gray-50">
          <button onClick={() => router.push('/admin/orders')} className="whitespace-nowrap px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
            未完成訂單
          </button>
          <button onClick={() => router.push('/admin/history')} className="whitespace-nowrap px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
            歷史訂單
          </button>
          <button onClick={() => router.push('/admin/menu')} className="whitespace-nowrap px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
            編輯菜單
          </button>
        </nav>
      </div>

      {/* 桌面版側邊欄 */}
      <div className="hidden sm:flex h-screen w-full">
        <aside className="w-64 bg-white border-r p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">後台管理</h2>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              登出
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            <button onClick={() => router.push('/admin/orders')} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
              未完成訂單
            </button>
            <button onClick={() => router.push('/admin/history')} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
              歷史訂單&收益
            </button>
            <button onClick={() => router.push('/admin/menu')} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
              編輯菜單
            </button>
          </nav>
        </aside>
        <Suspense fallback={<Loading />}>
          <main className="flex-1 overflow-auto bg-gray-50">
            {children}
          </main>
        </Suspense>
      </div>

      {/* 手機版內容區 */}
      <Suspense fallback={<Loading />}>
      <main className="sm:hidden bg-gray-50 min-h-[calc(100vh-104px)]">
        {children}
      </main>
      </Suspense>
    </div>
  )
}
