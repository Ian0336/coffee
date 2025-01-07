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
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => 
          item.menuId === action.payload.menuId && 
          item.ice === action.payload.ice &&
          item.milkRatio === action.payload.milkRatio
      )
      
      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: newItems }
      }
      return { ...state, items: [...state.items, action.payload] }

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