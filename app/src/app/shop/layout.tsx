
import '../globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import ShopHeader from '@/components/shop/Header'
import { Suspense } from 'react'
import Loading from '../loading'
import LiffProvider from '../_components/LiffProvider'
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
        <LiffProvider>
          <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <ShopHeader />
            <Suspense fallback={<Loading />}>
              <main className="pt-16">
                {children}
              </main>
            </Suspense>
          </div>
          </CartProvider>
        </LiffProvider>
      </body>
    </html>
  )
}
// import ShopHeader from '@/components/shop/Header'

// export default function ShopLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ShopHeader />
//       <main className="pt-16">
//         {children}
//       </main>
//     </div>
//   )
// }
