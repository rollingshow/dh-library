import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Редактирование тега
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id } = body
    const result = await prisma.tag.update({
        where: {
            id: id
        },
        data: {
            name: body.name
        }
    })
    return result
})
