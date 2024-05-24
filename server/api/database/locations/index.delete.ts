import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Удаление местоположения
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { id } = body
    const result = await prisma.location.delete({
        where: {
            id: id
        }
    })
    return result
})
