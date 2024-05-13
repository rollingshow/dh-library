import { PrismaClient, Prisma } from '@prisma/client'
import { useGetBookCover } from '~/composables/support/getBookCover'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { author, title, description, ISBN, type, locationId } = body

    Prisma.validator<Prisma.BookCreateInput>()({
        author,
        title,
        description,
        ISBN,
        type,
        location: locationId,
    })

    // If an ISBN is provided, try to get the thumbnailURL from Open Library or Google Books
    if (ISBN) {

    }

    // Create a book record
    let result = await prisma.book.create({
        data: {
            author,
            title,
            description,
            ISBN,
            type,
            location: { connect: { id: locationId } },
        },
    })

    // GET thumbnailURL from server/api/support/bookCover.get.ts
    let thumbnailURL = useGetBookCover(ISBN)


    // Create a bookMeta record if a thumbnailURL is found
    if (thumbnailURL !== '') {
        await prisma.bookMeta.create({
            data: {
                bookId: result.id,
                thumbnailURL: thumbnailURL ? thumbnailURL : null,
            },
        })
    }

    return result

})