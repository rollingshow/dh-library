import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Выборка тегов
export default defineEventHandler(async (event) => {
    const tags = await prisma.tag.findMany()
    return tags
})

