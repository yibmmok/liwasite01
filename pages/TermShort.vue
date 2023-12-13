<script setup lang="ts">
	/*********************************************************
	prog name: 會員合約簡單版, author: James Lin, date: 2023/02/16
	To Do: 
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch } from "@vueuse/core"
	import queryString from "query-string"

	const APIsvr = ref('')
	const liwaData = ref([])

	const loadData = async () => {
		let keydata = {
			'mainID': 'Terms'
		}
		let sQuery = queryString.stringify(keydata)	
		let url = `${APIsvr.value}/WPages_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]	
	}

	onMounted(() => {
		useHead({title:`會員合約`})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadData()
	})

	// definePageMeta({
	//   layout: false,
	//   colorMode: 'light'
	// })		

</script>

<template>
	<div class="w-full lg:w-[900px] mx-auto my-4" v-html="liwaData.sContent"></div>
</template>

<style scope>
	h2 {
		font-size:2rem;
		font-weight: bold;
		margin: 1rem 0;
	}
</style>