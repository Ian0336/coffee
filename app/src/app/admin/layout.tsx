// app/admin/layout.tsx
export const metadata = {
  title: 'Admin Panel - My Coffee Shop',
  description: '後台管理系統',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex">
      {/* 側邊欄 */}
      <aside className="w-64 bg-gray-100 border-r h-screen p-4">
        <h2 className="text-xl font-bold mb-4">後台管理</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin/orders" className="text-blue-600 hover:underline">
            未完成訂單
          </a>
          <a href="/admin/history" className="text-blue-600 hover:underline">
            歷史訂單&收益
          </a>
          <a href="/admin/menu" className="text-blue-600 hover:underline">
            編輯菜單
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </section>
  )
}
