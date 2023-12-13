<script setup lang="ts">
	/*********************************************************
	prog name: 隱私權, author: James Lin, date: 2022/12/31
	To Do: 缺內容
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch } from "@vueuse/core"
	import queryString from "query-string"

	const APIsvr = ref('')
	const liwaData = ref([])

	const loadData = async () => {
		let keydata = {
			'mainID': 'Privacy'
		}
		let sQuery = queryString.stringify(keydata)	
		let url = `${APIsvr.value}/WPages_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
		// console.log('liwaData = ', liwaData.value)		
	}

	onMounted(() => {
		useHead({title:`隱私權`})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadData()
	})

	// definePageMeta({
	//   layout: "web",
	//   colorMode: "light"
	// })		

</script>

<template>
<NuxtLayout name="web">		
	<div class="w-full lg:w-[900px] mx-auto my-4" v-html="liwaData.sContent"></div>
</NuxtLayout>	
</template>

<style scope>
	h2 {
		font-size:2rem;
		font-weight: bold;
		margin: 1rem 0;
	}
</style>