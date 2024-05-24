import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Удаление жанра
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id } = body
    const result = await prisma.genre.delete({
        where: {
            id: id
        }
    })
    return result
})
