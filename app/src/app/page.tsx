'use client'
// app/page.tsx


// 取得菜單資料
// async function getMenu() {
// const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menu`, {
//   cache: 'no-cache',
// })
// if (!res.ok) throw new Error('Failed to fetch menu data')
// return res.json()

//   // 模擬資料
//   // return [
//   //   { id: '1', name: '美式咖啡', description: '香濃黑咖啡', price: 60 },
//   //   { id: '2', name: '拿鐵', description: '牛奶與咖啡結合', price: 80 },
//   // ]
// }

export default function Home() {
    
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4">這裡什麼都沒有</h2>
      </div>
    </>
  )
}
