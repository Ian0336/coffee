// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Coffee Ordering System',
  description: 'A modern coffee ordering system built with Next.js App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 這裡可以放前台共用的導覽列等 */}
        <nav className="bg-white border-b p-4 shadow-sm">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">My Coffee Shop</h1>
          </div>
        </nav>
        
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
