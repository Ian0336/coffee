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
    <div className="min-h-screen">
      {/* 手機版頂部導航 */}
      <div className="sm:hidden bg-white border-b">
        <div className="p-4">
          <h2 className="text-lg font-bold">後台管理</h2>
        </div>
        <nav className="flex overflow-x-auto p-2 bg-gray-50">
          <a href="/admin/orders" className="whitespace-nowrap px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
            未完成訂單
          </a>
          <a href="/admin/history" className="whitespace-nowrap px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
            歷史訂單
          </a>
          <a href="/admin/menu" className="whitespace-nowrap px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
            編輯菜單
          </a>
        </nav>
      </div>

      {/* 桌面版側邊欄 */}
      <div className="hidden sm:flex h-screen">
        <aside className="w-64 bg-white border-r p-4">
          <h2 className="text-xl font-bold mb-4">後台管理</h2>
          <nav className="flex flex-col gap-2">
            <a href="/admin/orders" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
              未完成訂單
            </a>
            <a href="/admin/history" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
              歷史訂單&收益
            </a>
            <a href="/admin/menu" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
              編輯菜單
            </a>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* 手機版內容區 */}
      <main className="sm:hidden bg-gray-50 min-h-[calc(100vh-104px)]">
        {children}
      </main>
    </div>
  )
}
