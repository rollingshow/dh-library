<template>
    <div>
        <input v-model="searchQuery" @input="searchBooks" placeholder="Search books...">
        <ul>
            <li v-for="book in searchResults.books" :key="book.id">{{ book.title }} by {{ book.author }}</li>
        </ul>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            searchQuery: '',
            searchResults: [],
        };
    },
    methods: {
        async searchBooks() {
            try {
                if (this.searchQuery != '') {
                    const result = await $fetch('/api/books', {
                        method: 'GET',
                        query: {
                            search: this.searchQuery,
                            amount: 5,
                        }
                    })
                    this.searchResults = result;
                }

                console.log(this.searchResults);
            } catch (error) {
                console.error('Error searching books:', error);
            }
        },
    },
};
</script>