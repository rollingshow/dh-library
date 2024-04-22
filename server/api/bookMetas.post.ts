import { BookMeta, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const appConfig = useAppConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    var bookId = body.id !== undefined ? Number.parseInt(body.id as string) : 0

    var book = await prisma.book.findFirst({
        where: {
            id: bookId,
            ISBN: { not: null }
        }
    })

    if (book) {
        var isbn = book?.ISBN;

        if (isbn) {
            const metaData = await $fetch('https://openlibrary.org/isbn/' + isbn + '.json', {
                method: 'GET'
            })
            if (metaData) {
                await prisma.bookMeta.create({
                    data: {
                        bookId: book.id,
                        thumbnailURL: 'https://covers.openlibrary.org/b/isbn/' + isbn + '-L.jpg',
                    },
                })

                return true
            }
        }

    }

    return false
})