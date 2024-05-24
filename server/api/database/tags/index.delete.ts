import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Удаление тега
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id } = body
    const result = await prisma.tag.delete({
        where: {
            id: id
        }
    })
    return result
})
