// app/admin/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


export default function AdminHome() {
  const router = useRouter()
  useEffect(() => {
    router.push('/admin/orders')
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold">後台管理系統</h1>
      <p>歡迎進入後台！請從左側選單選擇要管理的項目。</p>
    </div>
  )
}
