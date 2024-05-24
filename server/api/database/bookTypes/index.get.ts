import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Выборка типов книг
export default defineEventHandler(async (event) => {
    const bookTypes = await prisma.bookType.findMany()
    return bookTypes
})
