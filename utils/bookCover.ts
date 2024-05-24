const providersConfig = useAppConfig().bookCoverProviders;

export const getBookCover = async (isbn: string) => {
    let thumbnailURL = '';

    // Если ISBN не передан, возвращаем пустую строку
    if (!isbn) {
        return null;
    }

    // Запрос к Open Library API
    let openLibraryData;
    openLibraryData = await fetchOpenLibraryData(isbn);

    try {
        // Получение обложки книги из Open Library
        if (providersConfig.openLibrary && openLibraryData.covers) {
            // Проверка на наличие обложки
            if (openLibraryData.covers.length > 0) {
                const coverId = openLibraryData.covers[0];
                const coverURL = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
                const response = await fetch(coverURL);
                if (response.ok) {
                    thumbnailURL = coverURL;
                }
            }
        }
    } catch (error) { }

    try {
        // Получение обложки книги из Google Books API
        if (providersConfig.googleBooks && thumbnailURL == '') {
            const googleBookCoverURL = await fetchGoogleBookCover(isbn, openLibraryData.title);

            thumbnailURL = googleBookCoverURL;

            // Add throttling to comply with Google Books API rate limits
            await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 0.2 second
        }
    } catch (error) { }

    try {
        if (thumbnailURL == '') {
            // Проверка на наличие обложки в ABE Books
            const checkCoverAvailability = async (isbn: string) => {
                const abeBookCoverURL = `https://pictures.abebooks.com/isbn/${isbn}.jpg`;
                const response = await fetch(abeBookCoverURL);
                if (response.ok) {
                    // Проверка, что изображение на самом деле является обложкой и размер содержимого больше 2000 байт (размер заглушки 1000 байт)
                    const imageSize = parseInt(await response.headers.get('content-length'), 10)
                    if (response.headers.get('content-type')?.startsWith('image/') && imageSize > 2000) {
                        return abeBookCoverURL;
                    } else {
                        return null;
                    }
                }
                return null;
            };

            if (thumbnailURL == '') {
                thumbnailURL = await checkCoverAvailability(isbn);
            }
        }
    } catch (error) { }

    if (thumbnailURL == '') {
        return null
    }
    return thumbnailURL;
};

/**
 * Fetches Open Library data for a given ISBN.
 *
 * @param {string} isbn - The ISBN of the book.
 * @return {Promise<any>} A promise that resolves to the Open Library data for the book.
 */
const fetchOpenLibraryData = async (isbn: string) => {
    try {
        const openLibraryData = await $fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return openLibraryData;
    } catch (error) {
        handleError(error);
    }

    return null
}

/**
 * Fetches the cover image URL for a book with the given ISBN from the Google Books API.
 *
 * @param {string} isbn - The ISBN of the book.
 * @param {string} [title] - The title of the book (optional).
 * @return {Promise<string>} A promise that resolves to the cover image URL, or an empty string if no cover image is found.
 */
const fetchGoogleBookCover = async (isbn: string, title?: string) => {
    try {
        const googleBooksData = await $fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
            method: 'GET',
        });

        if (googleBooksData.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
            return googleBooksData.items[0].volumeInfo.imageLinks.thumbnail;
        }
    } catch (error) {
        handleError(error);
    }
    return '';
}



/**
 * Handles the given error by logging it to the console with a colored background based on the cover provider.
 *
 * @param {Error} error - The error to be handled.
 * @return {void} This function does not return anything.
 */
const handleError = (error: Error) => {
    if (error.message.includes('openlibrary')) {
        console.info('%c' + error, 'background-color: yellow');
    } else if (error.message.includes('googleapis')) {
        console.info('%c' + error, 'background-color: blue');
    } else if (error.message.includes('yandex')) {
        console.info('%c' + error, 'background-color: orange');
    } else {
        console.info(error);
    }
};

