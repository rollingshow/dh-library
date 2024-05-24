import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Выборка авторов книг
export default defineEventHandler(async (event) => {
    const authors = await prisma.book.findMany(
        {
            select: {
                author: true
            },
            distinct: ['author'],
        }
    )
    return authors
})
