import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'
import { checkAdminSession } from '@/lib/auth'

// 生成新的 seed
function generateSeed() {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: Request) {
  try {
    const { password, sessionKey } = await request.json()

    if(password){
      // 從資料庫獲取管理員 session
      const adminSession = await prisma.adminSession.findFirst()
      if (!adminSession) {
        return NextResponse.json(
          { error: 'Admin session not found' },
          { status: 500 }
        )
      }

      if (password === adminSession.password) {
        const session = await checkAdminSession()
        return NextResponse.json({ seed: session?.seed || 'noSession' })
      }
      
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    if(sessionKey){
      const session = await checkAdminSession()
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