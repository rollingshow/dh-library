import { Prisma, PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

// Редактирование местоположения
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id } = body
    const result = await prisma.location.update({
        where: {
            id: id
        },
        data: {
            name: body.name
        }
    })
    return result
})
