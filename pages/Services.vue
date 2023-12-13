<script setup lang="ts">
	/*********************************************************
	prog name: 客服中心, author: James Lin, date: 2023/02/10
	To Do: JT.C 的客服中心
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch } from "@vueuse/core"
	import queryString from "query-string"

	const APIsvr = ref('')
	const liwaData = ref([])

	const loadData = async () => {
		let keydata = {
			'mainID': 'Services'
		}
		let sQuery = queryString.stringify(keydata)	
		let url = `${APIsvr.value}/WPages_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]	
	
	}

	onMounted(() => {
		useHead({title:`客服中心`})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadData()
	})

	// definePageMeta({
	//   layout: "web",
	//   colorMode: 'light'
	// })		

</script>

<template>
<NuxtLayout name="web">	
	<div class="w-full lg:w-[900px] mx-auto pt-[280px] text-6xl text-center">網頁建置中...</div>
</NuxtLayout>	
</template>

<style scope>
	h2 {
		font-size:2rem;
		font-weight: bold;
		margin: 1rem 0;
	}
</style>