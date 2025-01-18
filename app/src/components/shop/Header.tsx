'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function ShopHeader() {
  const pathname = usePathname()
  const { state } = useCart()
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/shop" className="text-xl font-bold text-gray-800 hover:text-gray-600">
            咖啡商店
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/shop"
              className={`text-sm font-medium transition-colors ${
                isActive('/shop') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              菜單
            </Link>
            
            <Link 
              href="/shop/history"
              className={`text-sm font-medium transition-colors ${
                isActive('/shop/history') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              訂單紀錄
            </Link>
            
            <Link 
              href="/shop/cart" 
              className="relative group"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 