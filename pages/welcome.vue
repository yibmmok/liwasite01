<script setup lang="ts">
  /*********************************************************
  prog name: 歡迎及提醒, author: James Lin, date: 2022/11/10

  **********************************************************/
	import { ref, onMounted, computed } from "vue"
	import { useFetch } from "@vueuse/core"
	import queryString from "query-string"

	const APIsvr = ref('')
	const liwaData = ref([])

	const loadData = async () => {
		let keydata = {
			'mainID': 'welcome'
		}
		let sQuery = queryString.stringify(keydata)	
		let url = `${APIsvr.value}/WPages_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]	
	}

	onMounted(() => {
		useHead({title:`歡迎與簡短操作教學`})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadData()		
	})

	// definePageMeta({
	// 	layout:"web",
	// 	colorMode: "light"
	// })
</script>

<template>
<NuxtLayout name="web">		
<div class="w-full lg:w-[900px] mx-auto my-4" v-html="liwaData.sContent"></div>	
</NuxtLayout>
</template>

<style scope>
	p {
		margin: .75rem 0;
	}
</style>