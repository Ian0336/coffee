// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import Header from './_components/Header'

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
          <main className="container mx-auto p-4">{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
