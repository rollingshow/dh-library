<template>
    <section class="library">
        <h1 class="title">Библиотека</h1>
        <!-- Поле поиска -->
        <input class="search-field" v-model="searchQuery" @input="refreshBooks"
            placeholder="Введите название или автора книги">

        <!-- Список книг -->
        <div class='cards-container'>
            <div class='card' v-for="book in searchResults.books" :key="book.id">
                <img class="card-thumbnail"
                    :src="(book.BookMeta != undefined && book.BookMeta[0] != undefined && book.BookMeta[0].thumbnailURL != null) ? book.BookMeta[0].thumbnailURL : '/images/no-image.svg'"
                    onerror="this.src='/images/no-image.svg'">
                <p class='card-title'>{{ book.title }}</p>
                <p class='card-author'>Автор: {{ book.author }}</p>
                <p class='card-location'>Локация: {{ book.location.name }}</p>
                <p class='card-description' v-if="book.description != null">Описание: {{ book.description }}</p>
                <div v-if="book.TagOnBook.length > 0" class="card-tags-container">
                    <span class='card-tag' v-for="tagOnBook in book.TagOnBook" :key="tagOnBook.tagId"> {{
                        tagOnBook.tag.name }}</span>
                </div>
                <div v-if="book.GenreOnBook.length > 0" class="card-genres-container">
                    <span class='card-genre' v-for="genreOnBook in book.GenreOnBook" :key="genreOnBook.genreId"> {{
                        genreOnBook.genre.name }}</span>
                </div>
            </div>
        </div>

        <!-- Пагинация на основе searchConfig.page и searchConfig.amount -->
        <div class="pagination">
            <button class="prev" @click="searchConfig.page--" :disabled="searchConfig.page == 0">Предыдущая</button>
            {{ searchConfig.page + 1 }}{{ searchResults.pages }}
            <button class="next" @click="searchConfig.page++"
                :disabled="!searchResults.books || (searchResults.books.length < searchConfig.amount)">Следующая</button>
        </div>

    </section>
</template>


<script lang="js">
import '~/assets/style/pages/library.scss'

useHead({
    title: 'Библиотека',
    meta: [
        { name: 'description', content: 'Поиск по книгам' }
    ],
})

// definePageMeta({ middleware: 'auth' })

export default {
    props: [
        'auth'
    ],
    mounted() {
        // Первичная загрузка данных 
        this.refreshBooks()
    },
    // Обновление при изменении параметров
    watch: {
        'searchConfig.page': function (newPage) {
            this.refreshBooks()
        },
        'searchConfig.amount': function (newAmount) {
            this.refreshBooks()
        },
        'searchConfig.sortBy': function (newSortBy) {
            this.refreshBooks()
        },
    },
    data() {
        return {
            // Данные поиска
            searchConfig: {
                page: 0,
                amount: 0,
                sortBy: '',
            },
            searchQuery: '',
            searchResults: [],
        };
    },
    methods: {
        // Получение данных
        async refreshBooks() {
            var searchRequest = {}

            // Заполнение параметров поиска
            if (this.searchConfig.page != 0)
                searchRequest.page = this.searchConfig.page
            if (this.searchConfig.amount != 0 && this.searchConfig.amount != useAppConfig().searchAmountDefault)
                searchRequest.amount = this.searchConfig.amount
            if (this.searchQuery != '')
                searchRequest.search = this.searchQuery
            else
                if (this.searchConfig.sortBy != '')
                    searchRequest.sortBy = this.searchConfig.sortBy

            try {
                // Запрос к API
                const books = await $fetch('/api/database/books', {
                    method: 'GET',
                    query: searchRequest
                })

                console.log(books)
                this.searchResults = books

                console.log(this.searchResults);
            } catch (error) {
                console.error('Error searching books:', error);
            }
        },
    },
};
</script>