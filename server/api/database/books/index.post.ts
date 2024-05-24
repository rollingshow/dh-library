import { PrismaClient, Prisma } from '@prisma/client'
import { getBookCover } from '~/utils/bookCover'

const prisma = new PrismaClient()

// Создание книги
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    let { author, title, description, ISBN, typeId, locationId, genreIds, tagIds } = body

    // Очистка ISBN
    ISBN = ISBN.replace(/[\s-]+/g, '').trim()
    if (ISBN.length === 10) {
        ISBN = '978' + ISBN
    }

    // Валидация данных через Prisma
    Prisma.validator<Prisma.BookCreateInput>()({
        author,
        title,
        description,
        ISBN,
        type: typeId,
        location: locationId,
    })

    // Создание книги
    let result = await prisma.book.create({
        data: {
            author: author ?? null,
            title: title ?? null,
            description: description ?? null,
            ISBN: ISBN ? ISBN : null,
            typeId: typeId,
            locationId: locationId ? locationId : null,
        },
    })

    console.log(body)

    // После создания книги, создание связей между книгой и жанрами и тегами
    if (genreIds) {
        await prisma.genreOnBook.createMany({
            data: genreIds.map((genreId: any) => ({
                bookId: result.id,
                genreId,
            })),
        })
    }
    if (tagIds) {
        await prisma.tagOnBook.createMany({
            data: tagIds.map((tagId: any) => ({
                bookId: result.id,
                tagId,
            })),
        })
    }

    // Получение обложки книги
    if (ISBN) {
        let thumbnailURL = await getBookCover(ISBN)

        // Сохранение обложки книги
        if (thumbnailURL !== '') {
            await prisma.bookMeta.create({
                data: {
                    bookId: result.id,
                    thumbnailURL: thumbnailURL ? thumbnailURL : null,
                },
            })
        }

    }

    return result

})