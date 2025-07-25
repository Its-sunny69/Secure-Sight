import { PrismaClient } from '@prisma/client'
import { subHours, addMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Create 3 cameras
  const cameras = await prisma.camera.createMany({
    data: [
      { name: 'Camera A', location: 'Shop Floor' },
      { name: 'Camera B', location: 'Basement Level 2' },
      { name: 'Camera C', location: 'Main Gate' },
    ],
  })

  const cameraList = await prisma.camera.findMany()
  const threatTypes = ['Unauthorized Access', 'Gun Threat', 'Face Recognised']
  const now = new Date()

  // Create 12 incidents with varied timestamps
  const incidents = Array.from({ length: 12 }).map((_, i) => {
    const camera = cameraList[i % cameraList.length]
    const type = threatTypes[i % threatTypes.length]
    const tsStart = subHours(now, 24 - i * 2)
    const tsEnd = addMinutes(tsStart, 5)

    return {
      cameraId: camera.id,
      type,
      tsStart,
      tsEnd,
      thumbnailUrl: `/thumbnails/thumb${(i % 5) + 1}.jpg`,
      resolved: Math.random() > 0.5,
    }
  })

  await prisma.incident.createMany({ data: incidents })

  console.log('Seeded successfully')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
