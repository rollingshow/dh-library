<style>
@import url("~/assets/style/library.scss");
</style>

<template>
    <section class="library">
        <h1 class="title">Библиотека</h1>
        <input class="search-field" v-model="searchQuery" @input="searchBooks"
            placeholder="Введите название или автора книги">

        <div class='cards-container'>
            <div class='card' v-for="book in searchResults.books" :key="book.id">
                <!-- <img class="card-thumbnail" :src="'https://covers.openlibrary.org/b/isbn/' + book.ISBN + '-L.jpg'"> -->
                <img class="card-thumbnail" :src="'https://pictures.abebooks.com/isbn/' + book.ISBN + '.jpg'"
                    onerror="this.src='/images/no-image.svg'">

                <p class='card-title'>{{ book.title }}</p>
                <p class='card-author'>Автор: {{ book.author }}</p>
                <p class='card-location'>Локация: {{ book.location.name }}</p>
                <p class='card-description' v-if="book.description != null">Описание: {{ book.description }}</p>
            </div>
        </div>

    </section>
</template>

<script lang="js">
export default {
    data() {
        return {
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
        async searchBooks() {
            var searchRequest = {}

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
                const books = await $fetch('/api/books', {
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