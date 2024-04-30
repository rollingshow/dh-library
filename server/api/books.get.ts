import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const appConfig = useAppConfig();

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    var page = query.page !== undefined ? Number.parseInt(query.page as string) : 0
    var amount = query.amount !== undefined ? Number.parseInt(query.amount as string) : appConfig.searchAmountDefault
    var searchQuery = "*" + (query.search as string) + "*"

    if (query.search !== undefined)
        var result = await prisma.book.findMany({
            skip: page * amount,
            take: amount,
            include: {
                location: true,
                TagOnBook: {
                    include: {
                        tag: true,
                    }

                },
                GenreOnBook: {
                    include: {
                        genre: true,
                    }
                }
            },
            where: {
                author: {
                    search: searchQuery,
                },
                title: {
                    search: searchQuery,
                }
            },
            orderBy: {
                _relevance:
                {
                    fields: ['title', 'author'],
                    search: searchQuery,
                    sort: 'desc',
                }
            }
        })
    else
        var result = await prisma.book.findMany({
            skip: page * amount,
            take: amount,
            include: {
                location: true,
                TagOnBook: {
                    include: {
                        tag: true,
                    }
                },
                GenreOnBook: {
                    include: {
                        genre: true,
                    }
                }



            },
        })

    return {
        books: result
    }
})