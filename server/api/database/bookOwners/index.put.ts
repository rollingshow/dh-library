import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Редактирование владельца
export default defineEventHandler(async (event) => {
    const body = readBody(event)

})
