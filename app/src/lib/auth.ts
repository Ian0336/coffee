import { prisma } from './db'
import crypto from 'crypto'

export async function verifyAdminSession(sessionKey: string) {
  const session = await checkAdminSession()
  if (!session || session.seed !== sessionKey) {
    return false
  }
  return true
} 
function generateSeed() {
  return crypto.randomBytes(32).toString('hex')
}
export async function checkAdminSession() {
  let session = await prisma.adminSession.findFirst()
  console.log('session', session)
  if (!session) return null

  const now = new Date()
  const updateTime = new Date(session.updateTime)
  const hoursDiff = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60)
  // const secondDiff = (now.getTime() - updateTime.getTime()) / (1000)

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
