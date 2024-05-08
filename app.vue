<template>
    <div>
        <NuxtLayout :auth="auth">
            <NuxtPage :auth="auth" />
        </NuxtLayout>
    </div>
</template>


<script>
export default {
    //данные приложения
    data() {
        return {
            // status, data, lastRefreshedAt, getCsrfToken, getProviders, getSession, signIn, signOut,
            auth: this.readAuthData(),
        }
    },
    //методы приложения
    methods: {
        //метод получения данных пользователя
        readAuthData() {
            let result = useAuth()
            return result
        },
    }

}
</script>
