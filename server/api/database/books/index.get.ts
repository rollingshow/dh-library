import { PrismaClient } from "@prisma/client";
import { getBookCover } from "~/utils/bookCover";

const prisma = new PrismaClient();
const appConfig = useAppConfig();

// Поиск и выборка по книгам
export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    // Обработка параметров поиска
    var page = query.page !== undefined ? Number.parseInt(query.page as string) : 0
    var amount = query.amount !== undefined ? Number.parseInt(query.amount as string) : appConfig.searchAmountDefault
    var searchQuery = "*" + (query.search as string) + "*"
    var result: any = []

    // Обработка поиска
    if (query.search !== undefined)
        result = await prisma.book.findMany({
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
                },
                BookMeta: {
                    select: {
                        thumbnailURL: true,
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
    // Получение книг без поиска
    else
        result = await prisma.book.findMany({
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
                },
                BookMeta: {
                    select: {
                        thumbnailURL: true,
                    }
                }
            },
        })

    return {
        books: result,
    }
})