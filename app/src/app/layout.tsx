// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import Header from './_components/Header'
import { Suspense } from 'react'
import Loading from './loading'

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
        <CartProvider>
          <Header />
          <Suspense fallback={<Loading />}>
            <main className="container mx-auto p-4">{children}</main>
          </Suspense>
        </CartProvider>
      </body>
    </html>
  )
}
