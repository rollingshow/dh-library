import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Выборка местоположений
export default defineEventHandler(async (event) => {
    const locations = await prisma.location.findMany()
    return locations

})
