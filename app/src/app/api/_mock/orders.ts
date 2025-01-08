// 模擬資料庫
export let mockOrders: Array<{
  id: string
  items: Array<{
    menuId: string
    menuItem: {
      id: string
      name: string
      price: number
    }
    ice: string
    milkRatio?: string
    quantity: number
  }>
  status: 'pending' | 'completed'
  createdAt: string
  completedAt?: string
}> = []

// 模擬菜單資料
export const mockMenu = {
  '1': { id: '1', name: '美式咖啡', price: 60 },
  '2': { id: '2', name: '拿鐵', price: 80 },
} 