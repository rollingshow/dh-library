// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    modules: ['@sidebase/nuxt-auth'],
    app: {
        head: {
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
                }
            ]
        }
    },
    auth: {
        isEnabled: true,
        baseURL: process.env.AUTH_ORIGIN,
        provider: {
            type: 'authjs',
        }
    },
    devServer: {
        port: 8000
    },
    // devtools: { enabled: false },
    css: [
        '~/assets/style/global.scss',
    ],
    runtimeConfig: {
        GoogleOAuth: {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        }
    },
    vite: {
        server: {
            fs: {
                // Allow serving files from one level up to the project root
                allow: ['..'],
            },
        },
    }
})
