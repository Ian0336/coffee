'use client'
import { createContext, useContext, useReducer, ReactNode } from 'react'

export type CartItem = {
  menuId: string
  menuItem: {
    id: string
    name: string
    price: number
    hasMilk?: boolean
  }
  quantity: number
  ice: string
  milkRatio?: string
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: CartItem }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // 使用區塊作用域避免變量污染
      const existingItemIndex = state.items.findIndex(
        item => 
          item.menuId === action.payload.menuId && 
          item.ice === action.payload.ice &&
          item.milkRatio === action.payload.milkRatio
      )
      
      if (existingItemIndex > -1) {
        // 創建新的 items 陣列，避免直接修改 state
        const newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity
            }
          }
          return item
        })
        return { ...state, items: newItems }
      }
      
      // 如果是新項目，直接添加到陣列末尾
      return { 
        ...state, 
        items: [...state.items, { ...action.payload }] 
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.menuId === action.payload.menuId && 
            item.ice === action.payload.ice &&
            item.milkRatio === action.payload.milkRatio)
        )
      }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}