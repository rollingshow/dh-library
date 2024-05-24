import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

// Редактирование жанра
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id, name } = body
    const result = await prisma.genre.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })
    return result
})
