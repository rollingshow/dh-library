<template>
    <div class="create-book">
        <form @submit="submitForm">

            <!-- Выбор с подсказкой по авторам -->
            <div class="field-wrapper">
                <label for="author" class="field-label">Автор</label>
                <input class="field" id="author" v-model="book.author" type="text" list="authors" placeholder="Автор"
                    required autocomplete="off" />
                <datalist id="authors">
                    <option v-for="author in sortedAuthors" :value="author.author">{{ author.author }}</option>
                </datalist>
            </div>

            <!-- Название книги -->
            <div class="field-wrapper">
                <label for="title" class="field-label">Название</label>
                <input class="field" id="title" v-model="book.title" placeholder="Название" required
                    autocomplete="off" />
            </div>

            <!-- Описание -->
            <div class="field-wrapper">
                <label for="description" class="field-label">Описание</label>
                <textarea class="field" id="description" v-model="book.description" placeholder="Описание" resize="none"
                    rows="6" autocomplete="off" />
            </div>

            <!-- ISBN -->
            <div class="field-wrapper">
                <label for="ISBN" class="field-label">ISBN</label>
                <input class="field" id="ISBN" v-model="book.ISBN" placeholder="ISBN" autocomplete="off" />
            </div>

            <!-- Выбор типа книги -->
            <div class="field-wrapper">
                <label for="type" class="field-label">Тип</label>
                <select class="field" id="type" v-model="book.typeId" autocomplete="off">
                    <option v-for='bookType in bookTypes' :value="bookType.id" :key="bookType.id">{{ bookType.name }}
                    </option>
                </select>
            </div>

            <!-- Выбор локации -->
            <div class="field-wrapper">
                <label for="location" class="field-label">Локация</label>
                <select class="field" id="location" v-model="book.locationId" autocomplete="off">
                    <option v-for="location in locations" :value="location.id" :key="location.id">{{ location.name }}
                    </option>
                </select>
            </div>

            <!-- Мультивыбор жанров с теггированием -->
            <div class="field-wrapper">
                <label for="genre" class="field-label">Жанры </label>
                <multiselect v-model="book.genreIds" :options="genres" :multiple="true" :close-on-select="false"
                    :clear-on-select="false" :preserve-search="false" placeholder="Поиск по жанрам" label="name"
                    track-by="id" :preselect-first="true" />
            </div>

            <!-- Мультивыбор тегов с теггированием -->
            <div class="field-wrapper">
                <label for="tag" class="field-label">Теги </label>
                <multiselect v-model="book.tagIds" :options="tags" :multiple="true" :close-on-select="false"
                    :clear-on-select="false" :preserve-search="false" placeholder="Поиск по тегам" label="name"
                    track-by="id" :preselect-first="true" />
            </div>

            <!-- Отправка формы -->
            <button type="submit" class="btn"
                :class="{ 'disabled': isButtonLocked, 'success': isSuccess, 'fail': isFail }">
                {{ buttonText }}
            </button>
        </form>

    </div>
</template>

<script>
// Стиль формы
import '~/assets/style/pages/admin/books/create.scss'
// Импорт компонента мультивыбора
import Multiselect from 'vue-multiselect';

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            // Данные книги
            book: {
                author: '',
                title: '',
                description: null,
                ISBN: null,
                typeId: null,
                locationId: null,
                genreIds: [],
                tagIds: []
            },
            bookTypes: [],
            locations: [],
            genres: [],
            tags: [],
            authors: [],
            // Кнопка
            isButtonLocked: false,
            isSuccess: false,
            isFail: false,
            buttonText: 'Создать книгу'
        }
    },
    mounted() {
        this.initializeData()
    },
    methods: {
        // Получение данных
        async initializeData() {
            this.bookTypes = await $fetch('/api/database/bookTypes')
            this.locations = await $fetch('/api/database/locations')
            this.genres = await $fetch('/api/database/genres')
            this.tags = await $fetch('/api/database/tags')
            this.authors = await $fetch('/api/database/authors')
        },
        // Отправка формы
        async submitForm() {
            // Блокировка кнопки
            this.isButtonLocked = true
            try {
                // Отправка данных
                const response = await $fetch('/api/database/books', {
                    method: 'POST',
                    body: JSON.stringify(this.book)
                })

                // Обработка ответа
                if (!response.ok) {
                    this.isFail = true
                    this.buttonText = 'Попробуйте ещё раз'
                    await new Promise(resolve => setTimeout(() => {
                        this.buttonText = 'Создать книгу'
                        this.isFail = false
                    }, 2000))
                } else {
                    this.isSuccess = true
                    this.book = {
                        author: '',
                        title: '',
                        description: '',
                        ISBN: '',
                        typeId: null,
                        locationId: null,
                        genreIds: [],
                        tagIds: []
                    }
                    this.buttonText = 'Операция выполнена'
                    await new Promise(resolve => setTimeout(() => {
                        this.buttonText = 'Создать книгу'
                        this.isSuccess = false
                    }, 4000))
                }
            } catch (error) {
                console.error(error)
            } finally {
                this.isButtonLocked = false
            }
        },
    },
    computed: {
        // Сортировка авторов
        sortedAuthors() {
            if (this.authors != undefined)
                return this.authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
            else
                return []
        }
    }
}
</script>
