<template>
    <div>
        <TheHeader />
    </div>
    <div class="w-full h-auto md:min-h-[calc(100vh_-_7rem)]">
        <slot></slot>
    </div>
    <!-- <div class="testBox"></div> -->
    <TheFooter />
</template>

<script setup>
const route = useRoute()

//useMeta({
//  title: computed(() => `珠寶交易中心 - ${route.meta.title}`)
//})

useHead({
    titleTemplate: '珠寶動產交易中心 - %s',
    title: '測試網頁'
})
	
</script>

<script>
import TheFooter from "~/components/TheFooter.vue"
import TheHeader from "~/components/TheHeader.vue"

export default {
    components: { TheHeader, TheFooter }
}
</script>
