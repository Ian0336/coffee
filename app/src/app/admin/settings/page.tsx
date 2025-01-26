'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSettings() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('新密碼與確認密碼不符')
      return
    }

    setIsLoading(true)
    try {
      const sessionKey = localStorage.getItem('adminSeed')
      if (!sessionKey) {
        alert('請先登入')
        router.push('/admin')
        return
      }

      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          sessionKey
        })
      })

      if (!res.ok) {
        if (res.status === 401) {
          alert('目前密碼錯誤或未授權')
          return
        }
        throw new Error('Failed to update password')
      }

      alert('密碼已更新')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      alert('更新密碼失敗')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl font-bold mb-4">管理員設定</h1>
      <form onSubmit={handleUpdatePassword} className="max-w-md">
        <div className="mb-4">
          <label className="block font-medium mb-2">目前密碼</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">新密碼</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">確認新密碼</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '更新中...' : '更新密碼'}
        </button>
      </form>
    </div>
  )
} 