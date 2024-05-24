import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Выборка жанров
export default defineEventHandler(async (event) => {
    const genres = await prisma.genre.findMany()
    return genres
})
