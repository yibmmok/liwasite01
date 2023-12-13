// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  modules: ['@formkit/nuxt', '@nuxtjs/tailwindcss'],
  formkit: {
    defaultConfig: true,
    configFile: "formkit.config.ts"
  }
})
