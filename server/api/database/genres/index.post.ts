import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Создание нового жанра
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name } = body

    Prisma.validator<Prisma.GenreCreateInput>()({
        name,
    })

    let result = await prisma.genre.create({
        data: {
            name,
        },
    })
})
