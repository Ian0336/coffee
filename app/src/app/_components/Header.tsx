'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <nav className="bg-white border-b p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">My Coffee Shop</Link>
        <Link href="/cart" className="text-blue-600 hover:underline">
          購物車
        </Link>
      </div>
    </nav>
  )
} 