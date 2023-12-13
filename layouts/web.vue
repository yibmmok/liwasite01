<template>
    <div>
        <TheHeader />
    </div>
    <div class="w-full min-h-[calc(100vh_-_11rem)] md:min-h-[calc(100vh_-_7rem)]">
        <slot></slot>
    </div>
    <TheFooter />
</template>

<script setup>
const route = useRoute()
	
</script>

<script>
import TheFooter from "~/components/TheFooter_web.vue"
import TheHeader from "~/components/TheHeader_web.vue"

export default {
    components: { TheHeader, TheFooter }
}
</script>
