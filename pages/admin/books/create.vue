<template>
    <form @submit.prevent="submitForm">
        <input v-model="book.author" placeholder="Author" required />
        <input v-model="book.title" placeholder="Title" required />
        <textarea v-model="book.description" placeholder="Description"></textarea>
        <input v-model="book.ISBN" placeholder="ISBN" />
        <select v-model="book.typeId">
            <option v-for="type in bookTypes" :value="type.id">{{ type.name }}</option>
        </select>
        <select v-model="book.locationId">
            <option v-for="location in locations" :value="location.id">{{ location.name }}</option>
        </select>
        <button type="submit">Create Book</button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            book: {
                author: '',
                title: '',
                description: '',
                ISBN: '',
                typeId: null,
                locationId: null
            },
            bookTypes: [],
            locations: []
        }
    },
    async setup() {
        this.bookTypes = await $fetch('/api/bookTypes')
        this.locations = await $fetch('/api/locations')
    },
    methods: {
        async submitForm() {
            const response = await $fetch('/api/books', {
                method: 'POST',
                body: JSON.stringify(this.book)
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`
                throw new Error(message)
            }

            const result = await response.json()
            console.log(result)
        }
    }
}
</script>