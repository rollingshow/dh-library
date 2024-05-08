<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import('~/assets/style/pages/auth.scss')

definePageMeta({
    layout: false
})
</script>

<template>
    <div class="auth-wrapper">
        <div class="auth-form">
            <div class="form-head">
                <button class="btn icon style-border" @click="$router.back()">
                    <span class="material-symbols-outlined">
                    arrow_back
                    </span>
                </button>
                <div>
                    <h1>Вход в аккаунт</h1>
                    <p>Авторизуйтесь в библиотечной системе</p>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn icon-button" @click="auth.signIn('google')">
                    <i class="icon fa-brands fa-google"></i>
                    <span>Войти с помощью Google</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: [
        'auth'
    ],
    mounted() {
        if (this.auth.status == 'authenticated') {
            if (this.$route.query.callbackUrl != null && this.$route.query.callbackUrl != undefined)
                navigateTo(this.$route.query.callbackUrl as RouteLocationRaw)
            else
                navigateTo('/')
        }
    }
}
</script>