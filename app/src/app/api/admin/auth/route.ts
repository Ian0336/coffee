import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

// 生成新的 seed
function generateSeed() {
  return crypto.randomBytes(32).toString('hex')
}

// 檢查是否需要更新 seed
async function checkAndUpdateSeed() {
  let session = await prisma.adminSession.findFirst()
  console.log('session', session)
  if (!session) return null

  const now = new Date()
  const updateTime = new Date(session.updateTime)
  const hoursDiff = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60)

  if (hoursDiff > 12) {
    const newSeed = generateSeed()
    return await prisma.adminSession.update({
      where: { id: session.id },
      data: {
        seed: newSeed,
        updateTime: now
      }
    })
  }
  
  return session
}

export async function POST(request: Request) {
  try {
    const { password, sessionKey } = await request.json()
    console.log('password', password, process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
    if(password){
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
          const session = await checkAndUpdateSeed()
          // if (!session) {
        //   return NextResponse.json(
        //     { error: 'Session not found' },
        //     { status: 500 }
        //   )
        // }
        return NextResponse.json({ seed: session?.seed || 'noSession' })
      }
      
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
    if(sessionKey){
      const session = await checkAndUpdateSeed()
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 500 }
        )
      }
      if(sessionKey !== session.seed){
        return NextResponse.json(
          { error: 'Invalid seed' },
          { status: 401 }
        )
      }
      return NextResponse.json({ seed: session.seed })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// export async function GET(request: Request) {
//   const { storedSeed } = await request.json()
//   try {
//     const session = await checkAndUpdateSeed()
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Session not found' },
//         { status: 500 }
//       )
//     }
//     if (storedSeed !== session.seed) {
//       return NextResponse.json(
//         { error: 'Invalid seed' },
//         { status: 401 }
//       )
//     }
//     return NextResponse.json({ seed: session.seed })
//   } catch (error) {
//     console.error('Auth error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// } 