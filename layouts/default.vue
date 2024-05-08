<script setup lang="ts">
import('~/assets/style/components/appHeader.scss')
</script>

<template>
    <div>
        <header>
            <div class="header-logo"></div>
            <div class="header-actions"></div>
            <div class="header-account">
                <template v-if="auth.status == 'authenticated'">
                    <div class="user-info">
                        <img class="user-img" :src="auth.data.user.image">
                        <div class="user-text">
                            <span class="user-name">{{ auth.data.user.name }}</span>
                            <span class="user-email">{{ auth.data.user.email }}</span>
                        </div>

                    </div>
                    <NuxtLink to="/logout" class="btn icon" @click="auth.signOut()">
                        <span class="material-symbols-outlined">
                            logout
                        </span>
                    </NuxtLink>
                </template>
                <template v-else>
                    <NuxtLink to="/login" class="btn"> Вход в аккаунт </NuxtLink>
                </template>
            </div>
        </header>
        <slot />
    </div>
</template>

<script lang="ts">
export default {
    props: [
        "auth"
    ],
};
</script>