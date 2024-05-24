import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Выборка комментариев
export default defineEventHandler(async (event) => {
    const comments = await prisma.comment.findMany()
    return comments
})
